import { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma";

export async function getHero(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const hero = await prisma.heroSection.findFirst();
    res.json({ success: true, data: hero, message: "OK" });
  } catch (err) {
    next(err);
  }
}

export async function upsertHero(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const existing = await prisma.heroSection.findFirst();

    const hero = existing
      ? await prisma.heroSection.update({ where: { id: existing.id }, data: req.body })
      : await prisma.heroSection.create({ data: req.body });

    res.json({ success: true, data: hero, message: "Hero section updated" });
  } catch (err) {
    next(err);
  }
}
