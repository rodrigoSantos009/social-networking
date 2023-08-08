import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"

import { UserError } from "../../../Errors/UserErrors/UserError";
import { UserRepository } from "../../../Repository/UserRepository/UserRepository";
import { User } from "../../../domain/Entities/User";
import { UpdateUser, UserDTO } from "../UserDTO/UserDTO";

export class UserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(data: UserDTO) {
    const UserAlreadyExists = await this.getUserByEmail(
      data.email
    );
    if (UserAlreadyExists) throw UserError.UserAlreadyExists();

    const hashPassword = await bcrypt.hash(data.password, 10);
    const user = new User(data.name, data.email, hashPassword);
    await this.userRepository.save(user);
    return user;
  }

  async getUserByEmail(email: string) {
    const users = await this.getUsers();
    const user = users.find(user => user.email === email);

    return user;
  }

  async getUserById(id: string) {
    const users = await this.getUsers();    
    const user =  users.find(user => user.id === id);

    return user ;
  }

  async authenticate(email: string, password: string) {
    const userExists = await this.getUserByEmail(email);
    if (!userExists) throw UserError.UserNotExists();
    const passwordMatch = await bcrypt.compare(password, userExists.password);
    if (!passwordMatch) throw UserError.UserNotExists();
    const token = jwt.sign(userExists, process.env.ACCESS_TOKEN_SECRET ?? "", {
      expiresIn: "15m",
    });

    return { token };
  }

  async updatePassword(id: string, password: string, newPassword: string) {
    const user = await this.getUserById(id);
    if (!user) throw UserError.UserNotExists();

    if (user.site_admin) {
      if (await bcrypt.compare(newPassword, user.password))
        throw new Error("Equal Passwords");
      newPassword = await bcrypt.hash(newPassword, 10);
      return await this.userRepository.updatePassword(id, newPassword);
    }

    if (!(await bcrypt.compare(password, user.password)))
      throw new Error("Incorrect Password!");
    if (await bcrypt.compare(newPassword, user.password))
      throw new Error("Equal Passwords");
    newPassword = await bcrypt.hash(newPassword, 10);
    return await this.userRepository.updatePassword(id, newPassword);
  }

  async updateUser(data: UpdateUser) {
    const user = await this.getUserById(data.id);
    if (!user) throw UserError.UserNotExists();

    const updatedUser = {
      id: data.id,
      name: data.name,
      bio: data.bio,
      picture: data.picture,
      site: data.site,
    };

    return await this.userRepository.updateUser(updatedUser);
  }

  async getUsers() {
    const users = await this.userRepository.getUsers();
    if (!users) throw UserError.UserNotExists();

    return users;
  }

  async followUnfollow(FollowingId: string, followedId: string) {
    const followingUser = await this.getUserById(FollowingId);
    if (!followingUser) throw UserError.UserNotExists();
    
    const followedUser = await this.getUserById(followedId);
    if (!followedUser) throw UserError.UserNotExists();

    const follower = await this.userRepository.followUnfollow(
      FollowingId,
      followedId
    );

    return follower;
  }

  async getFollowings(userId: string) {
    const followings = await this.userRepository.getFollowings(userId);
    if (!followings) throw new Error("This is no follows");

    return followings.map((following) => {
      const { password: _, ...rest } = following;
      return rest;
    });
  }

  async getFollowers(userId: string) {
    const followers = await this.userRepository.getFollowers(userId);
    if (!followers) throw new Error("This is no follows");

    return followers.map((follower) => {
      const { password: _, ...rest } = follower;
      return rest;
    });
  }
}

