import { Router } from "express";
import {
  getProcess,
  createStep,
  updateStep,
  deleteStep,
} from "../controllers/process.controller";
import { requireAuth } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { processStepSchema } from "../schemas/processStep.schema";

const router = Router();

router.get("/", getProcess);
router.post("/", requireAuth, validate(processStepSchema), createStep);
router.put("/:id", requireAuth, validate(processStepSchema.partial()), updateStep);
router.delete("/:id", requireAuth, deleteStep);

export default router;
