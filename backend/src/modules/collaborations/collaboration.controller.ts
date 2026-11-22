import type { Request, Response, NextFunction } from "express";
import { collaborationService } from "./collaboration.service.js";
import {
  collaborationQuerySchema,
  type CreateCollaborationInput,
  type UpdateCollaborationStatusInput,
  type UpdateCollaborationProposalInput,
} from "./collaboration.schema.js";

export const collaborationController = {
  // send a new collaboration proposal
  async createProposal(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const input: CreateCollaborationInput = req.body;

      const collaboration = await collaborationService.createProposal(userId, input);

      res.status(201).json({
        success: true,
        message: "collaboration proposal sent successfully",
        data: collaboration,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || "failed to send collaboration proposal",
      });
    }
  },

  // list user collaborations
  async getMyCollaborations(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const role = req.user!.role as "CREATOR" | "BRAND" | "ADMIN";
      const query = collaborationQuerySchema.parse(req.query);

      const result = await collaborationService.getMyCollaborations(userId, role, query);

      res.status(200).json({
        success: true,
        data: result.collaborations,
        pagination: result.pagination,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || "failed to fetch collaborations",
      });
    }
  },

  // get single collaboration details
  async getCollaborationById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const role = req.user!.role as "CREATOR" | "BRAND" | "ADMIN";
      const collaborationId = req.params.id as string;

      const collaboration = await collaborationService.getCollaborationById(
        userId,
        role,
        collaborationId
      );

      res.status(200).json({
        success: true,
        data: collaboration,
      });
    } catch (error: any) {
      res.status(404).json({
        success: false,
        message: error.message || "collaboration not found",
      });
    }
  },

  // update collaboration status
  async updateStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const role = req.user!.role as "CREATOR" | "BRAND" | "ADMIN";
      const collaborationId = req.params.id as string;
      const input: UpdateCollaborationStatusInput = req.body;

      const updated = await collaborationService.updateStatus(
        userId,
        role,
        collaborationId,
        input
      );

      res.status(200).json({
        success: true,
        message: "collaboration status updated successfully",
        data: updated,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || "failed to update collaboration status",
      });
    }
  },

  // update proposal terms
  async updateProposal(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const collaborationId = req.params.id as string;
      const input: UpdateCollaborationProposalInput = req.body;

      const updated = await collaborationService.updateProposal(
        userId,
        collaborationId,
        input
      );

      res.status(200).json({
        success: true,
        message: "collaboration proposal updated successfully",
        data: updated,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || "failed to update proposal",
      });
    }
  },
};
