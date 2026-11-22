import { Router } from "express";
import { collaborationController } from "./collaboration.controller.js";
import { authenticate } from "../../middleware/authenticate.js";
import { validate } from "../../middleware/validate.js";
import {
  createCollaborationSchema,
  updateCollaborationStatusSchema,
  updateCollaborationProposalSchema,
} from "./collaboration.schema.js";

const collaborationRouter: Router = Router();

collaborationRouter.use(authenticate);

collaborationRouter.post(
  "/",
  validate(createCollaborationSchema),
  collaborationController.createProposal
);

collaborationRouter.get("/", collaborationController.getMyCollaborations);

collaborationRouter.get("/:id", collaborationController.getCollaborationById);

collaborationRouter.patch(
  "/:id/status",
  validate(updateCollaborationStatusSchema),
  collaborationController.updateStatus
);

collaborationRouter.put(
  "/:id",
  validate(updateCollaborationProposalSchema),
  collaborationController.updateProposal
);

export default collaborationRouter;
