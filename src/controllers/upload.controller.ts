import { Request, Response, NextFunction } from "express";
import { cloudinary } from "../lib/cloudinary";
import { UploadApiResponse } from "cloudinary";

export async function uploadImage(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.file) {
      res.status(400).json({ success: false, data: null, message: "No file provided" });
      return;
    }

    const result = await new Promise<UploadApiResponse>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "construct-scenery", resource_type: "image" },
        (err, result) => {
          if (err || !result) return reject(err ?? new Error("Upload failed"));
          resolve(result);
        }
      );
      stream.end(req.file!.buffer);
    });

    res.json({
      success: true,
      data: { url: result.secure_url, publicId: result.public_id },
      message: "Image uploaded successfully",
    });
  } catch (err) {
    next(err);
  }
}
