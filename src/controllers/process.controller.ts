import { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma";

export async function getProcess(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const steps = await prisma.processStep.findMany({ orderBy: { order: "asc" } });
    res.json({ success: true, data: steps, message: "OK" });
  } catch (err) {
    next(err);
  }
}

export async function createStep(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const step = await prisma.processStep.create({ data: req.body });
    res.status(201).json({ success: true, data: step, message: "Process step created" });
  } catch (err) {
    next(err);
  }
}

export async function updateStep(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const step = await prisma.processStep.update({
      where: { id: Number(req.params.id) },
      data: req.body,
    });
    res.json({ success: true, data: step, message: "Process step updated" });
  } catch (err) {
    next(err);
  }
}

export async function deleteStep(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    await prisma.processStep.delete({ where: { id: Number(req.params.id) } });
    res.json({ success: true, data: null, message: "Process step deleted" });
  } catch (err) {
    next(err);
  }
}
