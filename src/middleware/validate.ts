import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

export function validate(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({
        success: false,
        data: result.error.flatten().fieldErrors,
        message: "Validation error",
      });
      return;
    }
    req.body = result.data;
    next();
  };
}
