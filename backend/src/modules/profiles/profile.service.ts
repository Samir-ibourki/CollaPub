import prisma from "../../prisma/client.js";
import type {
  UpdateCreatorProfileInput,
  UpdateBrandProfileInput,
  SocialAccountInput,
  PortfolioItemInput,
} from "./profile.schema.js";

export const profileService = {
  
  async getCreatorProfileByUserId(userId: string) {
    const profile = await prisma.creatorProfile.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phoneNumber: true,
            role: true,
          },
        },
        socialAccounts: true,
        portfolioItems: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!profile) {
      throw new Error("Creator profile not found");
    }

    return profile;
  },

  async updateCreatorProfile(userId: string, data: UpdateCreatorProfileInput) {
    return prisma.creatorProfile.update({
      where: { userId },
      data,
    });
  },

  async upsertSocialAccount(userId: string, data: SocialAccountInput) {
    const profile = await prisma.creatorProfile.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!profile) {
      throw new Error("Creator profile not found");
    }

    return prisma.socialAccount.upsert({
      where: {
        creatorProfileId_platform: {
          creatorProfileId: profile.id,
          platform: data.platform,
        },
      },
      create: {
        creatorProfileId: profile.id,
        platform: data.platform,
        handle: data.handle,
        profileUrl: data.profileUrl,
        followersCount: data.followersCount,
        engagementRate: data.engagementRate,
      },
      update: {
        handle: data.handle,
        profileUrl: data.profileUrl,
        followersCount: data.followersCount,
        engagementRate: data.engagementRate,
      },
    });
  },

  async deleteSocialAccount(userId: string, accountId: string) {
    const profile = await prisma.creatorProfile.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!profile) throw new Error("Creator profile not found");

    const account = await prisma.socialAccount.findUnique({
      where: { id: accountId },
    });

    if (!account || account.creatorProfileId !== profile.id) {
      throw new Error("Social account not found or unauthorized");
    }

    return prisma.socialAccount.delete({
      where: { id: accountId },
    });
  },

  async addPortfolioItem(userId: string, data: PortfolioItemInput) {
    const profile = await prisma.creatorProfile.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!profile) throw new Error("Creator profile not found");

    return prisma.portfolioItem.create({
      data: {
        creatorProfileId: profile.id,
        title: data.title,
        brandName: data.brandName,
        description: data.description,
        mediaUrl: data.mediaUrl,
        thumbnailUrl: data.thumbnailUrl,
        campaignUrl: data.campaignUrl,
        platform: data.platform,
      },
    });
  },

  async deletePortfolioItem(userId: string, itemId: string) {
    const profile = await prisma.creatorProfile.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!profile) throw new Error("Creator profile not found");

    const item = await prisma.portfolioItem.findUnique({
      where: { id: itemId },
    });

    if (!item || item.creatorProfileId !== profile.id) {
      throw new Error("Portfolio item not found or unauthorized");
    }

    return prisma.portfolioItem.delete({
      where: { id: itemId },
    });
  },

  // brand profile services
  async getBrandProfileByUserId(userId: string) {
    const profile = await prisma.brandProfile.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phoneNumber: true,
            role: true,
          },
        },
      },
    });

    if (!profile) {
      throw new Error("Brand profile not found");
    }

    return profile;
  },

  async updateBrandProfile(userId: string, data: UpdateBrandProfileInput) {
    return prisma.brandProfile.update({
      where: { userId },
      data,
    });
  },


  // public profiles (Discovery)

  async getPublicCreatorById(creatorProfileId: string) {
    const profile = await prisma.creatorProfile.findUnique({
      where: { id: creatorProfileId },
      include: {
        user: {
          select: {
            fullName: true,
            createdAt: true,
          },
        },
        socialAccounts: true,
        portfolioItems: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!profile) throw new Error("Creator not found");
    return profile;
  },

  async getPublicBrandById(brandProfileId: string) {
    const profile = await prisma.brandProfile.findUnique({
      where: { id: brandProfileId },
      include: {
        user: {
          select: {
            fullName: true,
            createdAt: true,
          },
        },
      },
    });

    if (!profile) throw new Error("Brand not found");
    return profile;
  },
};
