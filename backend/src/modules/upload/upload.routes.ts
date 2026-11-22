import { Router } from "express";
import { uploadController } from "./upload.controller.js";
import { upload } from "./upload.config.js";
import { authenticate } from "../../middleware/authenticate.js";

const uploadRouter: Router = Router();

uploadRouter.use(authenticate);

// single file upload endpoint
uploadRouter.post(
  "/single",
  upload.single("file"),
  uploadController.uploadSingle
);

// multiple files upload endpoint up to 5 files
uploadRouter.post(
  "/multiple",
  upload.array("files", 5),
  uploadController.uploadMultiple
);

export default uploadRouter;
