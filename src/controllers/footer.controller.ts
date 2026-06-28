import { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma";

export async function getFooter(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const footer = await prisma.footerSection.findFirst();
    res.json({ success: true, data: footer, message: "OK" });
  } catch (err) {
    next(err);
  }
}

export async function upsertFooter(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const existing = await prisma.footerSection.findFirst();

    const footer = existing
      ? await prisma.footerSection.update({ where: { id: existing.id }, data: req.body })
      : await prisma.footerSection.create({ data: req.body });

    res.json({ success: true, data: footer, message: "Footer updated" });
  } catch (err) {
    next(err);
  }
}
