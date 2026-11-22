import prisma from "../../prisma/client.js";
import type { FavoriteQueryParams } from "./favorite.schema.js";

export const favoriteService = {
  // toggle favorite status for a creator profile
  async toggleFavorite(userId: string, creatorProfileId: string) {

    const brand = await prisma.brandProfile.findUnique({
      where: { userId },
    });

    if (!brand) {
      throw new Error("only brand accounts can add creators to favorites");
    }


    const creator = await prisma.creatorProfile.findUnique({
      where: { id: creatorProfileId },
    });

    if (!creator) {
      throw new Error("creator profile not found");
    }


    const existing = await prisma.favorite.findUnique({
      where: {
        brandProfileId_creatorProfileId: {
          brandProfileId: brand.id,
          creatorProfileId,
        },
      },
    });

    if (existing) {
      // remove from favorites
      await prisma.favorite.delete({
        where: { id: existing.id },
      });

      return {
        isFavorited: false,
        message: "creator removed from favorites",
      };
    }

    // add to favorites
    await prisma.favorite.create({
      data: {
        brandProfileId: brand.id,
        creatorProfileId,
      },
    });

    return {
      isFavorited: true,
      message: "creator added to favorites",
    };
  },

  // get all favorited creators for the brand
  async getMyFavorites(userId: string, query: FavoriteQueryParams) {
    const { page, limit } = query;
    const skip = (page - 1) * limit;

    const brand = await prisma.brandProfile.findUnique({
      where: { userId },
    });

    if (!brand) {
      return {
        favorites: [],
        pagination: {
          total: 0,
          page,
          limit,
          totalPages: 0,
          hasNextPage: false,
          hasPrevPage: false,
        },
      };
    }

    const where = { brandProfileId: brand.id };

    const [total, favorites] = await Promise.all([
      prisma.favorite.count({ where }),
      prisma.favorite.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          creatorProfile: {
            include: {
              user: {
                select: {
                  id: true,
                  fullName: true,
                  email: true,
                },
              },
              socialAccounts: {
                select: {
                  platform: true,
                  handle: true,
                  followersCount: true,
                  engagementRate: true,
                },
              },
            },
          },
        },
      }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      favorites,
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

  // check if a creator is favorited by the current brand
  async checkIsFavorited(userId: string, creatorProfileId: string) {
    const brand = await prisma.brandProfile.findUnique({
      where: { userId },
    });

    if (!brand) {
      return { isFavorited: false };
    }

    const favorite = await prisma.favorite.findUnique({
      where: {
        brandProfileId_creatorProfileId: {
          brandProfileId: brand.id,
          creatorProfileId,
        },
      },
    });

    return {
      isFavorited: !!favorite,
    };
  },
};
