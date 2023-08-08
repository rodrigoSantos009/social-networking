import { UpdateUser } from "UseCases/User/UserDTO/UserDTO";
import { User } from "../../domain/Entities/User";
import { IUserRepository } from "./IUserRepository";
import { PrismaClient } from "@prisma/client"

export class UserRepository implements IUserRepository {
  constructor(private prisma: PrismaClient) {}

  async save(user: User): Promise<void> {
    await this.prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        password: user.password,
        bio: user.bio,
        picture: user.picture,
        site: user.site,
        site_admin: user.site_admin,
      },
    });
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findFirst({
      where: { email },
    });
    return user;
  }

  async updatePassword(id: string, newPassword: string): Promise<User | null> {
    const updatedUser = await this.prisma.user.update({
      where: {
        id,
      },
      data: {
        password: newPassword,
      },
    });

    return updatedUser;
  }

  async updateUser(user: UpdateUser): Promise<User | null> {
    const updatedUser = await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        name: user.name,
        bio: user.bio,
        picture: user.picture,
        site: user.site,
      },
    });

    return updatedUser;
  }

  async getUsers(): Promise<User[]> {
    return await this.prisma.user.findMany({
      include: {
        Posts: {
          include: {
            Comments: {
              select: {
                User: {
                  select: {
                    created_at: true,
                    id: true,
                    name: true,
                    email: true,
                    Comment: {
                      select: {
                        id: true,
                        comment: true,
                        created_at: true,
                        updated_at: true,
                      },
                    },
                  },
                },
              },
            },
            Like: {
              select: {
                created_at: true,
                User: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                  },
                },
              },
            },
            _count: {
              select: {
                Comments: true,
                Like: true,
              },
            },
          },
        },
        Followed: {
          select: {
            following: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
        Following: {
          select: {
            followed: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });
  }

  async followUnfollow(FollowingId: string, followedId: string): Promise<void> {
    const followings = await this.getFollowings(FollowingId);

    if (followings.some((following) => following.id === followedId)) {
      await this.prisma.follow.delete({
        where: {
          following_user_id_followed_user_id: {
            following_user_id: FollowingId,
            followed_user_id: followedId,
          },
        },
      });
    } else {
      await this.prisma.follow.create({
        data: {
          following_user_id: FollowingId,
          followed_user_id: followedId,
        },
      });
    }
  }

  async getFollowings(userId: string): Promise<User[]> {
    const followings = await this.prisma.follow.findMany({
      where: {
        following: {
          id: userId,
        },
      },
      include: {
        followed: true,
      },
    });
    return followings.map((following) => following.followed);
  }

  async getFollowers(userId: string): Promise<User[]> {
    const followers = await this.prisma.follow.findMany({
      where: {
        followed: {
          id: userId,
        },
      },
      include: {
        following: true,
      },
    });

    return followers.map((follower) => follower.following);
  }
}