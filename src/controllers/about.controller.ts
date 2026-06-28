import { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma";

export async function getAbout(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const about = await prisma.aboutSection.findFirst();
    res.json({ success: true, data: about, message: "OK" });
  } catch (err) {
    next(err);
  }
}

export async function upsertAbout(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const existing = await prisma.aboutSection.findFirst();

    const about = existing
      ? await prisma.aboutSection.update({ where: { id: existing.id }, data: req.body })
      : await prisma.aboutSection.create({ data: req.body });

    res.json({ success: true, data: about, message: "About section updated" });
  } catch (err) {
    next(err);
  }
}
