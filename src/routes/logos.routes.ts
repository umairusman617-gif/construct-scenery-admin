import { Router } from "express";
import {
  getLogos,
  createLogo,
  updateLogo,
  deleteLogo,
  reorderLogos,
} from "../controllers/logos.controller";
import { requireAuth } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { logoSchema, reorderSchema } from "../schemas/logo.schema";

const router = Router();

router.get("/", getLogos);
router.post("/", requireAuth, validate(logoSchema), createLogo);
router.put("/reorder", requireAuth, validate(reorderSchema), reorderLogos);
router.put("/:id", requireAuth, validate(logoSchema.partial()), updateLogo);
router.delete("/:id", requireAuth, deleteLogo);

export default router;
