import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { loginSchema, registerSchema } from "../schemas/authSchema.js";

const router = Router();

router.post("/register", async (req, res, next) => {
  try {
    const data = registerSchema.parse(req.body);
    const user = await prisma.user.create({ data });

    res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
    });
  } catch (e) {
    next(e);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const data = loginSchema.parse(req.body);
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user || user.password !== data.password) {
      return res.status(401).json({ error: "Credenciais inválidas" });
    }

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
    });
  } catch (e) {
    next(e);
  }
});

export default router;
