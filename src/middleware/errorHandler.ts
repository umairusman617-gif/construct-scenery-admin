import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof ZodError) {
    res.status(400).json({
      success: false,
      data: err.flatten().fieldErrors,
      message: "Validation error",
    });
    return;
  }

  if (err instanceof Error) {
    console.error(err.stack);
    res.status(500).json({
      success: false,
      data: null,
      message: process.env.NODE_ENV === "production" ? "Internal server error" : err.message,
    });
    return;
  }

  res.status(500).json({ success: false, data: null, message: "Internal server error" });
}
