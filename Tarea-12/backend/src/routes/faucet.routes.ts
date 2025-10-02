import { Router } from "express";
import { claimTokens, getStatus } from "../services/faucet.service.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/claim", authenticate, claimTokens);
router.get("/status/:address", authenticate, getStatus);

export default router;
