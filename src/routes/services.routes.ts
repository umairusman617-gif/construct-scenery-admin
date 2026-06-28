import { Router } from "express";
import {
  getServices,
  createService,
  updateService,
  deleteService,
} from "../controllers/services.controller";
import { requireAuth } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { serviceSchema } from "../schemas/service.schema";

const router = Router();

router.get("/", getServices);
router.post("/", requireAuth, validate(serviceSchema), createService);
router.put("/:id", requireAuth, validate(serviceSchema.partial()), updateService);
router.delete("/:id", requireAuth, deleteService);

export default router;
