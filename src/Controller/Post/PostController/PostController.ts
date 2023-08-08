import { PostUseCase } from "UseCases/Post/PostUseCase/PostUseCase";
import { Request, Response } from "express";

export class PostController {
  constructor(
    public postUseCase: PostUseCase
  ) {}

  async handle(req: Request, res: Response): Promise<Response> {
    const description = req.body.description;
    const user_id = req.user?.id;
    const image  = req.file?.filename;

    try { 
      const post = await this.postUseCase.execute({
        user_id,
        image,
        description
      });
      return res.status(201).json(post);
    } catch (error) {
      console.log(error)
      return res.status(400).json(error)
    }
  }

  async getPostById(req: Request, res: Response): Promise<Response> {
    const { postId } = req.params;
    
    try {
      const post = await this.postUseCase.getPostById(postId);

      return res.status(200).json(post);
    } catch (error) {
      return res.status(400).json(error)
    }
  }

  async getFollowingsPosts(req: Request, res: Response): Promise<Response> {
    const id = req.user?.id;

    try {
      const followingsPosts = await this.postUseCase.getFollowingsPosts(id);

      return res.status(200).json(followingsPosts);
    } catch (error) {
      return res.status(400).json(error);
    }
  }

  async deletePost(req: Request, res: Response): Promise<Response> {
    const { postId } = req.params;  
    const userId = req.user?.id;
    
    try {
      await this.postUseCase.deletePost(postId, userId);

      return res.status(200).json();
    } catch (error) {
      console.log(error)
      return res.status(200).json(error);
    }
  }

  async getLike(req: Request, res: Response): Promise<Response> {
    const { postId } = req.params;

    try {
      const likes = await this.postUseCase.getLike(postId);

      return res.status(200).json(likes);
    } catch (error) {
      console.log(error)
      return res.status(400).json(error);
    }
  }

  async likePost(req: Request, res: Response): Promise<Response> {
    const userId = req.user?.id;
    const { postId } = req.params;

    try {
      const post = await this.postUseCase.likePost(postId, userId);
      
      return res.status(201).json(post);
    } catch (error) {
      console.log(error)
      return res.status(400).json(error)
    }
  }

  async getCommentById(req: Request, res: Response): Promise<Response> {
    const { id } = req.body;

    try {
      const comment = await this.postUseCase.getCommentById(id);

      return res.status(200).json(comment);
    } catch (error) {
      console.log(error)
      return res.status(400).json(error);
    }
  }

  async getCommentsByPost(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;

    try {
      const comments = await this.postUseCase.getCommentsByPost(id);

      return res.status(200).json(comments);
    } catch (error) {
      return res.status(400).json(error);
    }
  }

  async commentPost(req: Request, res: Response): Promise<Response> {
    const { postId } = req.params;
    const { comment } = req.body;
    const userId = req.user?.id;

    try {
      const post = await this.postUseCase.commentPost(postId, userId, comment);

      return res.status(201).json(post);
    } catch (error) {
      return res.status(400).json(error);
    }
  }

  async deleteComment(req: Request, res: Response): Promise<Response> {
    const { postId } = req.params;
    const { commentId } = req.body;
    const userId = req.user?.id;

    try {
      const comment = await this.postUseCase.deleteComment(
        commentId,
        postId,
        userId
      );

      return res.status(200).json(comment);
    } catch (error) {
      console.log(error)
      return res.status(400).json(error);
    }
  } 
}