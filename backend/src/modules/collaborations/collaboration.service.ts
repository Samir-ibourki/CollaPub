import prisma from "../../prisma/client.js";
import type {
  CreateCollaborationInput,
  UpdateCollaborationStatusInput,
  UpdateCollaborationProposalInput,
  CollaborationQueryParams,
} from "./collaboration.schema.js";

export const collaborationService = {

  async createProposal(userId: string, data: CreateCollaborationInput) {

    const brandProfile = await prisma.brandProfile.findUnique({
      where: { userId },
    });

    if (!brandProfile) {
      throw new Error("only brand profiles can send collaboration proposals");
    }

    // verify target creator profile exists
    const creatorProfile = await prisma.creatorProfile.findUnique({
      where: { id: data.creatorProfileId },
      include: { user: true },
    });

    if (!creatorProfile) {
      throw new Error("target creator profile not found");
    }

    // create the collaboration record
    const collaboration = await prisma.collaboration.create({
      data: {
        brandProfileId: brandProfile.id,
        creatorProfileId: data.creatorProfileId,
        title: data.title,
        description: data.description,
        deliverables: data.deliverables,
        proposedBudget: data.proposedBudget,
        deadline: data.deadline ? new Date(data.deadline) : null,
        status: "PENDING",
      },
      include: {
        brandProfile: {
          select: {
            id: true,
            companyName: true,
            logoUrl: true,
            city: true,
          },
        },
        creatorProfile: {
          select: {
            id: true,
            avatarUrl: true,
            city: true,
            user: {
              select: {
                fullName: true,
              },
            },
          },
        },
      },
    });

    // notify the creator about the new collaboration request
    await prisma.notification.create({
      data: {
        userId: creatorProfile.userId,
        type: "NEW_COLLABORATION_REQUEST",
        title: "Nouvelle proposition de collaboration",
        message: `${brandProfile.companyName} vous a envoyé une proposition de partenariat: "${data.title}"`,
        metadata: {
          collaborationId: collaboration.id,
          brandProfileId: brandProfile.id,
        },
      },
    });

    return collaboration;
  },

  // get user collaborations depending on whether they are creator or brand
  async getMyCollaborations(
    userId: string,
    role: "CREATOR" | "BRAND" | "ADMIN",
    query: CollaborationQueryParams
  ) {
    const { status, page, limit } = query;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (status) {
      where.status = status;
    }

    if (role === "BRAND") {
      const brand = await prisma.brandProfile.findUnique({
        where: { userId },
        select: { id: true },
      });
      if (!brand) return { collaborations: [], pagination: { total: 0, page, limit, totalPages: 0 } };
      where.brandProfileId = brand.id;
    } else if (role === "CREATOR") {
      const creator = await prisma.creatorProfile.findUnique({
        where: { userId },
        select: { id: true },
      });
      if (!creator) return { collaborations: [], pagination: { total: 0, page, limit, totalPages: 0 } };
      where.creatorProfileId = creator.id;
    }

    const [total, collaborations] = await Promise.all([
      prisma.collaboration.count({ where }),
      prisma.collaboration.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          brandProfile: {
            select: {
              id: true,
              companyName: true,
              logoUrl: true,
              city: true,
              industry: true,
            },
          },
          creatorProfile: {
            select: {
              id: true,
              avatarUrl: true,
              city: true,
              isVerified: true,
              user: {
                select: {
                  fullName: true,
                  email: true,
                },
              },
            },
          },
        },
      }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      collaborations,
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
  },

  // get single collaboration details with access permission check
  async getCollaborationById(
    userId: string,
    role: "CREATOR" | "BRAND" | "ADMIN",
    collaborationId: string
  ) {
    const collaboration = await prisma.collaboration.findUnique({
      where: { id: collaborationId },
      include: {
        brandProfile: {
          include: {
            user: {
              select: {
                id: true,
                fullName: true,
                email: true,
              },
            },
          },
        },
        creatorProfile: {
          include: {
            user: {
              select: {
                id: true,
                fullName: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!collaboration) {
      throw new Error("collaboration not found");
    }

    // verify that caller is part of this collaboration
    const isBrandOwner = collaboration.brandProfile.userId === userId;
    const isCreatorOwner = collaboration.creatorProfile.userId === userId;
    const isAdmin = role === "ADMIN";

    if (!isBrandOwner && !isCreatorOwner && !isAdmin) {
      throw new Error("unauthorized to view this collaboration");
    }

    return collaboration;
  },

  // update collaboration status with role-based workflow enforcement
  async updateStatus(
    userId: string,
    role: "CREATOR" | "BRAND" | "ADMIN",
    collaborationId: string,
    input: UpdateCollaborationStatusInput
  ) {
    const collaboration = await prisma.collaboration.findUnique({
      where: { id: collaborationId },
      include: {
        brandProfile: true,
        creatorProfile: true,
      },
    });

    if (!collaboration) {
      throw new Error("collaboration not found");
    }

    const isBrandOwner = collaboration.brandProfile.userId === userId;
    const isCreatorOwner = collaboration.creatorProfile.userId === userId;
    const isAdmin = role === "ADMIN";

    if (!isBrandOwner && !isCreatorOwner && !isAdmin) {
      throw new Error("unauthorized to modify this collaboration");
    }

    const currentStatus = collaboration.status;
    const nextStatus = input.status;

    // creators can accept, reject or negotiate pending collaborations
    if (isCreatorOwner && !isAdmin) {
      const allowedCreatorTransitions = ["ACCEPTED", "REJECTED", "NEGOTIATING", "COMPLETED"];
      if (!allowedCreatorTransitions.includes(nextStatus)) {
        throw new Error(`creator cannot transition status to ${nextStatus}`);
      }
      if (currentStatus === "CANCELLED" || currentStatus === "REJECTED") {
        throw new Error("cannot update an already cancelled or rejected collaboration");
      }
    }

    // brands can cancel, set in progress or mark completed
    if (isBrandOwner && !isAdmin) {
      const allowedBrandTransitions = ["CANCELLED", "NEGOTIATING", "IN_PROGRESS", "COMPLETED"];
      if (!allowedBrandTransitions.includes(nextStatus)) {
        throw new Error(`brand cannot transition status to ${nextStatus}`);
      }
      if (currentStatus === "COMPLETED") {
        throw new Error("cannot modify an already completed collaboration");
      }
    }

    const updated = await prisma.collaboration.update({
      where: { id: collaborationId },
      data: { status: nextStatus },
      include: {
        brandProfile: {
          select: { companyName: true, userId: true },
        },
        creatorProfile: {
          select: { userId: true },
        },
      },
    });

    // notify the other party about status change
    const recipientUserId = isBrandOwner
      ? collaboration.creatorProfile.userId
      : collaboration.brandProfile.userId;

    let notificationTitle = "Mise à jour du partenariat";
    let notificationMessage = `Le statut de la collaboration "${collaboration.title}" est maintenant: ${nextStatus}`;

    await prisma.notification.create({
      data: {
        userId: recipientUserId,
        type: nextStatus === "ACCEPTED" ? "COLLABORATION_ACCEPTED" : nextStatus === "REJECTED" ? "COLLABORATION_REJECTED" : "COLLABORATION_UPDATED",
        title: notificationTitle,
        message: notificationMessage,
        metadata: {
          collaborationId: collaboration.id,
          nextStatus,
        },
      },
    });

    return updated;
  },

  // update proposal terms during negotiation
  async updateProposal(
    userId: string,
    collaborationId: string,
    data: UpdateCollaborationProposalInput
  ) {
    const collaboration = await prisma.collaboration.findUnique({
      where: { id: collaborationId },
      include: {
        brandProfile: true,
        creatorProfile: true,
      },
    });

    if (!collaboration) {
      throw new Error("collaboration not found");
    }

    const isBrandOwner = collaboration.brandProfile.userId === userId;
    if (!isBrandOwner) {
      throw new Error("only the brand can update proposal terms");
    }

    if (collaboration.status !== "PENDING" && collaboration.status !== "NEGOTIATING") {
      throw new Error("can only update terms while proposal is pending or negotiating");
    }

    return prisma.collaboration.update({
      where: { id: collaborationId },
      data: {
        title: data.title,
        description: data.description,
        deliverables: data.deliverables,
        proposedBudget: data.proposedBudget,
        deadline: data.deadline ? new Date(data.deadline) : undefined,
      },
    });
  },
};
