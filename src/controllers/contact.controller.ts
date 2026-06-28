import { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma";

export async function getContact(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const contact = await prisma.contactSection.findFirst();
    res.json({ success: true, data: contact, message: "OK" });
  } catch (err) {
    next(err);
  }
}

export async function upsertContact(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const existing = await prisma.contactSection.findFirst();

    const contact = existing
      ? await prisma.contactSection.update({ where: { id: existing.id }, data: req.body })
      : await prisma.contactSection.create({ data: req.body });

    res.json({ success: true, data: contact, message: "Contact section updated" });
  } catch (err) {
    next(err);
  }
}
