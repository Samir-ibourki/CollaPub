import prisma from "../../prisma/client.js";
import type {
  CreatePostInput,
  UpdatePostInput,
  FeedQueryParams,
} from "./post.schema.js";

export const postService = {
  // create a new post by creator or brand
  async createPost(
    userId: string,
    authorRole: "CREATOR" | "BRAND" | "ADMIN",
    data: CreatePostInput
  ) {

    let city = data.city;
    if (!city) {
      if (authorRole === "CREATOR") {
        const creator = await prisma.creatorProfile.findUnique({
          where: { userId },
          select: { city: true },
        });
        city = creator?.city;
      } else if (authorRole === "BRAND") {
        const brand = await prisma.brandProfile.findUnique({
          where: { userId },
          select: { city: true },
        });
        city = brand?.city ?? undefined;
      }
    }

    return prisma.post.create({
      data: {
        authorId: userId,
        authorRole,
        title: data.title,
        caption: data.caption,
        mediaUrls: data.mediaUrls,
        mediaType: data.mediaType,
        category: data.category,
        city,
        tags: data.tags,
      },
      include: {
        author: {
          select: {
            id: true,
            fullName: true,
            role: true,
            creatorProfile: {
              select: {
                id: true,
                avatarUrl: true,
                city: true,
                isVerified: true,
              },
            },
            brandProfile: {
              select: {
                id: true,
                companyName: true,
                logoUrl: true,
                city: true,
              },
            },
          },
        },
      },
    });
  },

  // get commercial discovery feed with pagination and filters
  async getFeed(query: FeedQueryParams) {
    const { role, category, city, search, page, limit } = query;
    const skip = (page - 1) * limit;

    // build dynamic filtering condition
    const where: any = {};

    if (role) {
      where.authorRole = role;
    }

    if (category) {
      where.category = {
        equals: category,
        mode: "insensitive",
      };
    }

    if (city) {
      where.city = {
        equals: city,
        mode: "insensitive",
      };
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { caption: { contains: search, mode: "insensitive" } },
        { category: { contains: search, mode: "insensitive" } },
        { author: { fullName: { contains: search, mode: "insensitive" } } },
      ];
    }

    // execute count and query in parallel
    const [total, posts] = await Promise.all([
      prisma.post.count({ where }),
      prisma.post.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          author: {
            select: {
              id: true,
              fullName: true,
              role: true,
              creatorProfile: {
                select: {
                  id: true,
                  avatarUrl: true,
                  city: true,
                  isVerified: true,
                },
              },
              brandProfile: {
                select: {
                  id: true,
                  companyName: true,
                  logoUrl: true,
                  city: true,
                },
              },
            },
          },
        },
      }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      posts,
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

  // get single post by id and increment view counter
  async getPostById(postId: string) {
    const post = await prisma.post.update({
      where: { id: postId },
      data: {
        viewsCount: { increment: 1 },
      },
      include: {
        author: {
          select: {
            id: true,
            fullName: true,
            role: true,
            creatorProfile: {
              select: {
                id: true,
                avatarUrl: true,
                city: true,
                isVerified: true,
              },
            },
            brandProfile: {
              select: {
                id: true,
                companyName: true,
                logoUrl: true,
                city: true,
              },
            },
          },
        },
      },
    });

    if (!post) {
      throw new Error("post not found");
    }

    return post;
  },

  // get all posts published by a specific author
  async getPostsByAuthor(authorId: string) {
    return prisma.post.findMany({
      where: { authorId },
      orderBy: { createdAt: "desc" },
      include: {
        author: {
          select: {
            id: true,
            fullName: true,
            role: true,
            creatorProfile: {
              select: {
                id: true,
                avatarUrl: true,
                isVerified: true,
              },
            },
            brandProfile: {
              select: {
                id: true,
                companyName: true,
                logoUrl: true,
              },
            },
          },
        },
      },
    });
  },

  // update post by author
  async updatePost(userId: string, postId: string, data: UpdatePostInput) {
    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      throw new Error("post not found");
    }

    if (post.authorId !== userId) {
      throw new Error("unauthorized to edit this post");
    }

    return prisma.post.update({
      where: { id: postId },
      data,
    });
  },

  // delete post by author
  async deletePost(userId: string, postId: string) {
    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      throw new Error("post not found");
    }

    if (post.authorId !== userId) {
      throw new Error("unauthorized to delete this post");
    }

    return prisma.post.delete({
      where: { id: postId },
    });
  },

  // toggle like on a post
  async likePost(postId: string) {
    return prisma.post.update({
      where: { id: postId },
      data: {
        likesCount: { increment: 1 },
      },
      select: {
        id: true,
        likesCount: true,
      },
    });
  },
};
