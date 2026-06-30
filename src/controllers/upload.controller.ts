import { Request, Response, NextFunction } from "express";
import { v2 as cloudinary } from "cloudinary";
import { prisma } from "../lib/prisma";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadImage(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.file) {
      res.status(400).json({ success: false, data: null, message: "No file provided" });
      return;
    }

    const result = await new Promise<{ secure_url: string; public_id: string }>((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder: "construct-scenery", resource_type: "image" },
        (err, result) => {
          if (err || !result) return reject(err ?? new Error("Cloudinary upload failed"));
          resolve({ secure_url: result.secure_url, public_id: result.public_id });
        }
      ).end(req.file!.buffer);
    });

    const media = await prisma.mediaFile.create({
      data: {
        url: result.secure_url,
        publicId: result.public_id,
        filename: req.file.originalname,
        mimeType: req.file.mimetype,
        size: req.file.size,
      },
    });

    res.json({
      success: true,
      data: { url: media.url, publicId: media.publicId, id: media.id },
      message: "Image uploaded successfully",
    });
  } catch (err) {
    next(err);
  }
}
