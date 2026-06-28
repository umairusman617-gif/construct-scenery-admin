import { Router } from "express";
import {
  getTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} from "../controllers/testimonials.controller";
import { requireAuth } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { testimonialSchema } from "../schemas/testimonial.schema";

const router = Router();

router.get("/", getTestimonials);
router.post("/", requireAuth, validate(testimonialSchema), createTestimonial);
router.put("/:id", requireAuth, validate(testimonialSchema.partial()), updateTestimonial);
router.delete("/:id", requireAuth, deleteTestimonial);

export default router;
