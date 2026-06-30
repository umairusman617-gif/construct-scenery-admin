import { Request, Response, NextFunction } from "express";
import { v2 as cloudinary } from "cloudinary";
import { prisma } from "../lib/prisma";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function listMedia(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const files = await prisma.mediaFile.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json({ success: true, data: files, message: "OK" });
  } catch (err) {
    next(err);
  }
}

export async function deleteMedia(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseInt(String(req.params.id), 10);
    const file = await prisma.mediaFile.findUnique({ where: { id } });
    if (!file) {
      res.status(404).json({ success: false, data: null, message: "Not found" });
      return;
    }
    await cloudinary.uploader.destroy(file.publicId);
    await prisma.mediaFile.delete({ where: { id } });
    res.json({ success: true, data: null, message: "Deleted" });
  } catch (err) {
    next(err);
  }
}
