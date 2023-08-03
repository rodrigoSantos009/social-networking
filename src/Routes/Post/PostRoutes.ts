import upload from "../../Config/Multer";
import { PostController } from "Controller/Post/PostController/PostController";
import AuthMiddleware from "../../Middleware/AuthMiddleware";
import { Router } from "express";

export class PostRoutes {
  constructor(
    public postController: PostController,
    public router: Router  
  ) {
    this.loadRoutes();
  }

  loadRoutes() {
    /* CREATE POST */
    this.router.post(
      "/post",
      AuthMiddleware,
      upload.single("file"),
      this.postController.handle.bind(this.postController)
    );
    /* GET POST BY ID */
    this.router.get(
      "/post/:postId",
      this.postController.getPostById.bind(this.postController)
    );
    /* GET FOLLOWINGS POST */
    this.router.get(
      "/followings/posts",
      AuthMiddleware,
      this.postController.getFollowingsPosts.bind(this.postController)
    );
    /* DELETE POST */
    this.router.delete(
      "/post/:postId",
      AuthMiddleware,
      this.postController.deletePost.bind(this.postController)
    );
    /* GET LIKES FROM POST */
    this.router.get(
      "/post/:postId/like",
      AuthMiddleware,
      this.postController.getLike.bind(this.postController)
    );
    /* LIKE POST */
    this.router.post(
      "/post/:postId",
      AuthMiddleware,
      this.postController.likePost.bind(this.postController)
    );
    /* GET COMMENT BY ID FROM POST */
    this.router.get(
      "/post/comment",
      this.postController.getCommentById.bind(this.postController)
    );
    /* GET COMMENTS BY POST */
    this.router.get(
      "/post/:id/comments",
      this.postController.getCommentsByPost.bind(this.postController)
    );
    /* COMMENT POST */
    this.router.post(
      "/post/:postId/comment",
      AuthMiddleware,
      this.postController.commentPost.bind(this.postController)
    );
    /* DELETE COMMENT FROM POST */
    this.router.delete(
      "/post/:postId/comment",
      AuthMiddleware,
      this.postController.deleteComment.bind(this.postController)
    );
  }
}