import { UpdateUser } from "UseCases/User/UserDTO/UserDTO";
import { User } from "../../domain/Entities/User";

export interface IUserRepository {
  save(user: User): Promise<void>;
  getUserByEmail(email: string): Promise<User | null>;
  getUsers(): Promise<User[]>;
  updatePassword(id: string, newPassword: string): Promise<User | null>;
  updateUser(user: UpdateUser): Promise<User | null>;
  followUnfollow(followingId: string, followedId: string): Promise<void>;
  getFollowings(userId: string): Promise<User[]>;
  getFollowers(userId: string): Promise<User[]>;
}