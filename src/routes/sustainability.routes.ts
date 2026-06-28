import { Router } from "express";
import {
  getSustainability,
  upsertSustainability,
  createItem,
  updateItem,
  deleteItem,
} from "../controllers/sustainability.controller";
import { requireAuth } from "../middleware/auth";
import { validate } from "../middleware/validate";
import {
  sustainabilitySectionSchema,
  sustainabilityItemSchema,
} from "../schemas/sustainability.schema";

const router = Router();

router.get("/", getSustainability);
router.put("/", requireAuth, validate(sustainabilitySectionSchema.partial()), upsertSustainability);
router.post("/items", requireAuth, validate(sustainabilityItemSchema), createItem);
router.put("/items/:id", requireAuth, validate(sustainabilityItemSchema.partial()), updateItem);
router.delete("/items/:id", requireAuth, deleteItem);

export default router;
