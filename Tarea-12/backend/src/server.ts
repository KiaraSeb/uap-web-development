import express from "express";
import cors from "cors";
import { env } from "./config/env.js";
import authRoutes from "./routes/auth.routes.js";
import faucetRoutes from "./routes/faucet.routes.js";

const app = express();
app.use(cors());
app.use(express.json());

// rutas
app.use("/auth", authRoutes);
app.use("/faucet", faucetRoutes);

app.listen(env.PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${env.PORT}`);
});
