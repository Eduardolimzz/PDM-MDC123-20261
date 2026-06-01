import { verifyAccessToken } from "../lib/auth.js";

export function authRequired(req, res, next) {
  const header = req.headers.authorization ?? "";
  const [type, token] = header.split(" ");
  if (type !== "Bearer" || !token) {
    return res.status(401).json({ error: "Acesso negado" });
  }

  try {
    req.user = verifyAccessToken(token);
    return next();
  } catch {
    return res.status(401).json({ error: "Token invÃ¡lido" });
  }
}

