import { Router } from "express";
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
} from "../controllers/projects.controller";
import { requireAuth } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { projectSchema } from "../schemas/project.schema";

const router = Router();

router.get("/", getProjects);
router.post("/", requireAuth, validate(projectSchema), createProject);
router.put("/:id", requireAuth, validate(projectSchema.partial()), updateProject);
router.delete("/:id", requireAuth, deleteProject);

export default router;
