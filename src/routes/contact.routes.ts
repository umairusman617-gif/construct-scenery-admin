import { Router } from "express";
import { getContact, upsertContact } from "../controllers/contact.controller";
import { requireAuth } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { contactSchema } from "../schemas/contact.schema";

const router = Router();

router.get("/", getContact);
router.put("/", requireAuth, validate(contactSchema), upsertContact);

export default router;
