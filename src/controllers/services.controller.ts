import { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma";

export async function getServices(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const services = await prisma.service.findMany({ orderBy: { order: "asc" } });
    res.json({ success: true, data: services, message: "OK" });
  } catch (err) {
    next(err);
  }
}

export async function createService(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const service = await prisma.service.create({ data: req.body });
    res.status(201).json({ success: true, data: service, message: "Service created" });
  } catch (err) {
    next(err);
  }
}

export async function updateService(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const service = await prisma.service.update({
      where: { id: Number(req.params.id) },
      data: req.body,
    });
    res.json({ success: true, data: service, message: "Service updated" });
  } catch (err) {
    next(err);
  }
}

export async function deleteService(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    await prisma.service.delete({ where: { id: Number(req.params.id) } });
    res.json({ success: true, data: null, message: "Service deleted" });
  } catch (err) {
    next(err);
  }
}
