import { Router } from "express";
import multer from "multer";
import { uploadImage } from "../controllers/upload.controller";
import { requireAuth } from "../middleware/auth";

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 200 * 1024 * 1024 } });

router.post("/", requireAuth, upload.single("image"), uploadImage);

export default router;
