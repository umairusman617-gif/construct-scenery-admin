import { Router } from "express";
import { getAbout, upsertAbout } from "../controllers/about.controller";
import { requireAuth } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { aboutSchema } from "../schemas/about.schema";

const router = Router();

router.get("/", getAbout);
router.put("/", requireAuth, validate(aboutSchema), upsertAbout);

export default router;
