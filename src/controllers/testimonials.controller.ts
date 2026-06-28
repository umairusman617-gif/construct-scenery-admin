import { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma";

export async function getTestimonials(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const testimonials = await prisma.testimonial.findMany({ orderBy: { order: "asc" } });
    res.json({ success: true, data: testimonials, message: "OK" });
  } catch (err) {
    next(err);
  }
}

export async function createTestimonial(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const testimonial = await prisma.testimonial.create({ data: req.body });
    res.status(201).json({ success: true, data: testimonial, message: "Testimonial created" });
  } catch (err) {
    next(err);
  }
}

export async function updateTestimonial(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const testimonial = await prisma.testimonial.update({
      where: { id: Number(req.params.id) },
      data: req.body,
    });
    res.json({ success: true, data: testimonial, message: "Testimonial updated" });
  } catch (err) {
    next(err);
  }
}

export async function deleteTestimonial(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    await prisma.testimonial.delete({ where: { id: Number(req.params.id) } });
    res.json({ success: true, data: null, message: "Testimonial deleted" });
  } catch (err) {
    next(err);
  }
}
