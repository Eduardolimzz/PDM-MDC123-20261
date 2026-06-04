import "dotenv/config";
import express from "express";
import cors from "cors";
import categoriesRouter from "./routes/categories.js";
import transactionsRouter from "./routes/transactions.js";
import authRouter from "./routes/auth.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { authRequired } from "./middlewares/authRequired.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.json({ ok: true, name: "gestao-financeira-api" }));

app.use("/auth", authRouter);

const requireAuth = String(process.env.REQUIRE_AUTH ?? "false").toLowerCase() === "true";
if (requireAuth) {
  app.use(authRequired);
}

app.use("/categories", categoriesRouter);
app.use("/transactions", transactionsRouter);

app.use(errorHandler);

const port = process.env.PORT ?? 3000;
app.listen(port, () => {
  console.log(`API rodando em http://localhost:${port}`);
});
