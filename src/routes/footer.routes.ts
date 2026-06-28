import { Router } from "express";
import { getFooter, upsertFooter } from "../controllers/footer.controller";
import { requireAuth } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { footerSchema } from "../schemas/footer.schema";

const router = Router();

router.get("/", getFooter);
router.put("/", requireAuth, validate(footerSchema.partial()), upsertFooter);

export default router;
