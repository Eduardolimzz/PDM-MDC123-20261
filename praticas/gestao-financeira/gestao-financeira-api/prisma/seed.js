import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/lib/auth.js";

const prisma = new PrismaClient();

const defaultCategories = [
  {
    name: "income",
    displayName: "Renda",
    icon: "work",
    background: "#DE9AC3",
    isIncome: true,
    isDefault: true,
  },
  {
    name: "food",
    displayName: "AlimentaÃ§Ã£o",
    icon: "fastfood",
    background: "#DEA17B",
    isIncome: false,
    isDefault: true,
  },
  {
    name: "house",
    displayName: "Casa",
    icon: "home",
    background: "#E6E088",
    isIncome: false,
    isDefault: true,
  },
  {
    name: "education",
    displayName: "EducaÃ§Ã£o",
    icon: "book",
    background: "#AB8FBE",
    isIncome: false,
    isDefault: true,
  },
  {
    name: "travel",
    displayName: "Viagens",
    icon: "airplanemode-active",
    background: "#82C9DE",
    isIncome: false,
    isDefault: true,
  },
];

async function main() {
  for (const category of defaultCategories) {
    await prisma.category.upsert({
      where: { name: category.name },
      update: {},
      create: category,
    });
  }

  const passwordHash = await hashPassword("123456");
  await prisma.user.upsert({
    where: { email: "aluno@exemplo.com" },
    update: {},
    create: { name: "Aluno", email: "aluno@exemplo.com", passwordHash },
  });

  console.log("Seed concluÃ­do.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

