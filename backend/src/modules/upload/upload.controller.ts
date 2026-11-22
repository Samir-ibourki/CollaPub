import type { Request, Response, NextFunction } from "express";

export const uploadController = {
  // handle single file upload
  async uploadSingle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.file) {
        res.status(400).json({
          success: false,
          message: "no file uploaded",
        });
        return;
      }

      const file = req.file;
      const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${file.filename}`;

      res.status(201).json({
        success: true,
        message: "file uploaded successfully",
        data: {
          url: fileUrl,
          filename: file.filename,
          originalName: file.originalname,
          mimetype: file.mimetype,
          size: file.size,
        },
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || "failed to upload file",
      });
    }
  },

  // handle multiple files upload
  async uploadMultiple(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const files = req.files as Express.Multer.File[];

      if (!files || files.length === 0) {
        res.status(400).json({
          success: false,
          message: "no files uploaded",
        });
        return;
      }

      const uploadedFiles = files.map((file) => ({
        url: `${req.protocol}://${req.get("host")}/uploads/${file.filename}`,
        filename: file.filename,
        originalName: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
      }));

      res.status(201).json({
        success: true,
        message: "files uploaded successfully",
        data: uploadedFiles,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || "failed to upload files",
      });
    }
  },
};
