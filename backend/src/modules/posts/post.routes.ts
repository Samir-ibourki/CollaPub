import { Router } from "express";
import { postController } from "./post.controller.js";
import { authenticate } from "../../middleware/authenticate.js";
import { validate } from "../../middleware/validate.js";
import { createPostSchema, updatePostSchema } from "./post.schema.js";

const postRouter: Router = Router();

// public discovery routes
postRouter.get("/", postController.getFeed);
postRouter.get("/:id", postController.getPostById);
postRouter.get("/author/:authorId", postController.getPostsByAuthor);

// protected publishing and management routes
postRouter.post(
  "/",
  authenticate,
  validate(createPostSchema),
  postController.createPost
);

postRouter.put(
  "/:id",
  authenticate,
  validate(updatePostSchema),
  postController.updatePost
);

postRouter.delete("/:id", authenticate, postController.deletePost);

postRouter.post("/:id/like", authenticate, postController.likePost);

export default postRouter;
