import type { Request, Response, NextFunction } from "express";
import { postService } from "./post.service.js";
import {
  createPostSchema,
  updatePostSchema,
  feedQuerySchema,
  type CreatePostInput,
  type UpdatePostInput,
} from "./post.schema.js";

export const postController = {
  // publish a new post
  async createPost(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const role = req.user!.role;
      const input: CreatePostInput = req.body;

      const post = await postService.createPost(userId, role, input);

      res.status(201).json({
        success: true,
        message: "post published successfully",
        data: post,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || "failed to create post",
      });
    }
  },

  // get discovery feed with query parameters
  async getFeed(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const query = feedQuerySchema.parse(req.query);
      const result = await postService.getFeed(query);

      res.status(200).json({
        success: true,
        data: result.posts,
        pagination: result.pagination,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || "failed to fetch feed",
      });
    }
  },

  // get single post details
  async getPostById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const postId = req.params.id as string;
      const post = await postService.getPostById(postId);

      res.status(200).json({
        success: true,
        data: post,
      });
    } catch (error: any) {
      res.status(404).json({
        success: false,
        message: error.message || "post not found",
      });
    }
  },

  // get all posts by an author id
  async getPostsByAuthor(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const authorId = req.params.authorId as string;
      const posts = await postService.getPostsByAuthor(authorId);

      res.status(200).json({
        success: true,
        data: posts,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || "failed to fetch author posts",
      });
    }
  },

  // update post
  async updatePost(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const postId = req.params.id as string;
      const input: UpdatePostInput = req.body;

      const updated = await postService.updatePost(userId, postId, input);

      res.status(200).json({
        success: true,
        message: "post updated successfully",
        data: updated,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || "failed to update post",
      });
    }
  },

  // delete post
  async deletePost(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const postId = req.params.id as string;

      await postService.deletePost(userId, postId);

      res.status(200).json({
        success: true,
        message: "post deleted successfully",
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || "failed to delete post",
      });
    }
  },

  // like post
  async likePost(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const postId = req.params.id as string;
      const result = await postService.likePost(postId);

      res.status(200).json({
        success: true,
        message: "post liked successfully",
        data: result,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || "failed to like post",
      });
    }
  },
};
