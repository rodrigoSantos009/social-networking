import { Like, Comment, PrismaClient, User } from "@prisma/client";
import { IPostRepository } from "./IPostRepository";
import { Post } from "domain/Entities/Post";

export class PostRepository implements IPostRepository {
  constructor(public prisma: PrismaClient) {}

  async savePost(post: Post) {
    await this.prisma.post.create({
      data: {
        user_id: post.user_id,
        image: post.image,
        description: post.description,
      },
    });
  }

  async getPostById(postId: string): Promise<Post | null> {
    const post = await this.prisma.post.findUnique({
      where: {
        id: postId
    }
    });

    return post;
  }

  async getFollowingsPosts(id: string): Promise<Post[]> {
    return await this.prisma.$queryRaw`
        SELECT
          Posts.*, FollowingUsers.name
        FROM
          Posts
          RIGHT JOIN Users AS FollowingUsers ON Posts.user_id = FollowingUsers.id
        WHERE
          FollowingUsers.id IN (
            SELECT followed_user_id
            FROM Follows
            WHERE following_user_id = ${id}
          )
          ORDER BY Posts.created_at DESC
      `;
  }

  async deletePost(postId: string) {
    await this.prisma.comment.deleteMany({
      where: {
        post_id: postId
      }
    });

    await this.prisma.like.deleteMany({
      where: {
        post_id: postId
      }
    });

    await this.prisma.post.delete({
      where: {
        id: postId,
      },
    });
  }

  async getLike(postId: string): Promise<Like | null> {
    const likes = await this.prisma.like.findFirst({
      where: {
        post_id: postId,
      },
    });

    return likes;
  }

  async likePost(id: string, userId: string): Promise<void> {
    const like = await this.getLike(id);

    if (like?.user_id === userId) {
      await this.prisma.like.delete({
        where: {
          id: like.id,
        },
      });
    } else {
      await this.prisma.like.create({
        data: {
          post_id: id,
          user_id: userId,
        },
      });
    }
  }

  async saveComment(postId: string,userId: string, comment: string): Promise<void> {
    await this.prisma.comment.create({
      data: {
        comment,
        post_id: postId,
        user_id: userId,
      },
    });
  }

  async getCommentById(id: string): Promise<Comment | null> {
    const comment = await this.prisma.comment.findUnique({
      where: {
        id
      }
    })

    return comment;
  }

  async getCommentsByPost(id: string): Promise<Comment[]> {
    const comment = await this.prisma.comment.findMany({
      where: {
        post_id: id
      }
    });

    return comment;
  }

  async deleteComment(id: string): Promise<void> {
    await this.prisma.comment.delete({
      where: {
        id
      }
    })
  }
}