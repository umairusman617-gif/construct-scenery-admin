import { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma";

export async function getLogos(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const logos = await prisma.logo.findMany({ orderBy: { order: "asc" } });
    res.json({ success: true, data: logos, message: "OK" });
  } catch (err) {
    next(err);
  }
}

export async function createLogo(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const logo = await prisma.logo.create({ data: req.body });
    res.status(201).json({ success: true, data: logo, message: "Logo created" });
  } catch (err) {
    next(err);
  }
}

export async function updateLogo(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const logo = await prisma.logo.update({
      where: { id: Number(req.params.id) },
      data: req.body,
    });
    res.json({ success: true, data: logo, message: "Logo updated" });
  } catch (err) {
    next(err);
  }
}

export async function deleteLogo(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    await prisma.logo.delete({ where: { id: Number(req.params.id) } });
    res.json({ success: true, data: null, message: "Logo deleted" });
  } catch (err) {
    next(err);
  }
}

export async function reorderLogos(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { ids } = req.body as { ids: number[] };
    await Promise.all(
      ids.map((id, index) => prisma.logo.update({ where: { id }, data: { order: index } }))
    );
    res.json({ success: true, data: null, message: "Logos reordered" });
  } catch (err) {
    next(err);
  }
}
