import { PostRepository } from "Repository/PostRepository/PostRepository";
import { PostDTO } from "../PostDTO/PostDTO";
import { UserRepository } from "Repository/UserRepository/UserRepository";
import { UserError } from "../../../Errors/UserErrors/UserError";
import { Post } from "../../../domain/Entities/Post";

export class PostUseCase {
  constructor(
    public postRepository: PostRepository,
    public userRepository: UserRepository
  ) {}

  async execute(data: PostDTO) {
    const userExists = await this.userRepository.getUserById(data.user_id);
    if(!userExists) throw UserError.UserNotExists();

    const post = new Post(data.user_id, data.image, data.description);
    await this.postRepository.savePost(post);
    return post;
  }

  async getPostById(postId: string) {
    const post = await this.postRepository.getPostById(postId);
    if(!post) throw new Error("Post not found");

    return post;
  }

  async getFollowingsPosts(id: string) {
    const posts = await this.postRepository.getFollowingsPosts(id);

    return posts;
  }

  async deletePost(postId: string, userId: string) {
    const post = await this.getPostById(postId);
    if(!post) throw new Error("Post not found!")

    const user = await this.userRepository.getUserById(userId);

    if (post.user_id !== userId || !user?.site_admin) throw new Error("You can not delete this post!")

    await this.postRepository.deletePost(postId); 
  }

  async getLike(postId: string) {
    const likes = await this.postRepository.getLike(postId);
    if(!likes) throw new Error("There is no likes!")

    return likes;
  }

  async likePost(postId: string, userId: string) {
    const post = await this.getPostById(postId);
    if (!post) throw new Error("Post not found");

    const userExists = await this.userRepository.getUserById(userId);
    if (!userExists) throw UserError.UserNotExists();

    await this.postRepository.likePost(postId, userId);
  }

  async getCommentById(id: string) {
    const comment = await this.postRepository.getCommentById(id);
    if(!comment) throw new Error("Comment not found!");

    return comment;
  }

  async getCommentsByPost(id: string) {
    const comments = await this.postRepository.getCommentsByPost(id);
    if(!comments) throw new Error("There is no comment!");

    return comments;
  }

  async commentPost(postId: string, userId: string, comment: string) {
    const post = await this.getPostById(postId);
    if(!post) throw new Error("Post not found!")

    const userExists = await this.userRepository.getUserById(userId);
    if (!userExists) throw UserError.UserNotExists();
    
    await this.postRepository.saveComment(postId, userId, comment);
  }

  async deleteComment(commentId: string, postId: string, userId: string) {
    const post = await this.getPostById(postId)
    if(!post) throw new Error("Post not found!");

    const comment = await this.getCommentById(commentId);
    if (!comment) throw new Error("Post not found!");

    const user = await this.userRepository.getUserById(userId);
    if (!user) throw UserError.UserNotExists();

    if (
      comment.user_id !== userId ||
      post.user_id !== userId ||
      !user.site_admin
    ) throw new Error("You can not delete this!");
      
    await this.postRepository.deleteComment(comment.id);
  }
}