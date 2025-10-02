import { Router } from "express";
import { getAuthMessage, signIn } from "../services/auth.service.js";

const router = Router();

router.post("/message", getAuthMessage);
router.post("/signin", signIn);

export default router;
