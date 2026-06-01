import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { loginSchema } from "../schemas/authSchema.js";
import { signAccessToken, verifyPassword } from "../lib/auth.js";

const router = Router();

// POST /auth/login
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = loginSchema.parse(req.body);
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ error: "Credenciais invÃ¡lidas" });

    const ok = await verifyPassword(password, user.passwordHash);
    if (!ok) return res.status(401).json({ error: "Credenciais invÃ¡lidas" });

    const token = signAccessToken({ sub: user.id, email: user.email, name: user.name });
    return res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (e) {
    next(e);
  }
});

export default router;

