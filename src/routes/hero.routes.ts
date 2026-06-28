import { Router } from "express";
import { getHero, upsertHero } from "../controllers/hero.controller";
import { requireAuth } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { heroSchema } from "../schemas/hero.schema";

const router = Router();

router.get("/", getHero);
router.put("/", requireAuth, validate(heroSchema), upsertHero);

export default router;
