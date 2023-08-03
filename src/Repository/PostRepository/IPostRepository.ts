import { Comment, Like } from "@prisma/client";
import { Post } from "domain/Entities/Post";


export interface IPostRepository {
  savePost(post: Post): Promise<void>;
  getPostById(postId: string): Promise<Post | null>;
  getFollowingsPosts(id: string): Promise<Post[]>;
  deletePost(postId: string): Promise<void>;
  getLike(postId: string): Promise<Like | null>;
  likePost(postId: string, userId: string): Promise<void>;
  saveComment(postId: string, userId: string, comment: string): Promise<void>;
  getCommentById(id: string): Promise<Comment | null>;
  getCommentsByPost(id: string): Promise<Comment[]>;
  deleteComment(id: string): Promise<void>;
}