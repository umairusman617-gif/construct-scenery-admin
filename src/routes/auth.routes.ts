import { Router } from "express";
import { login, verify } from "../controllers/auth.controller";
import { requireAuth } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { loginSchema } from "../schemas/auth.schema";

const router = Router();

router.post("/login", validate(loginSchema), login);
router.post("/verify", requireAuth, verify);

export default router;
