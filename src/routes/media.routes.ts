import { Router } from "express";
import { listMedia, deleteMedia } from "../controllers/media.controller";
import { requireAuth } from "../middleware/auth";

const router = Router();

router.get("/", requireAuth, listMedia);
router.delete("/:id", requireAuth, deleteMedia);

export default router;
