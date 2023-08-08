import { Request, Response } from "express";
import { UserUseCase } from "../../UseCases/User/UserUseCase/UserUseCase";

export class UserController {
  constructor(private userUseCase: UserUseCase) {}

  async handle(req: Request, res: Response): Promise<Response> {
    const { name, email, password } = req.body;

    try {
      const user = await this.userUseCase.execute({
        name,
        email,
        password,
      });

      return res.status(200).json(user);
    } catch (error) {
      return res.status(400).send({ error });
    }
  }

  async authenticate(req: Request, res: Response): Promise<Response> {
    const { email, password } = req.body;

    try {
      const user = await this.userUseCase.authenticate(email, password);

      return res.status(200).json(user);
    } catch (error) {
      return res.status(400).json({ error });
    }
  }

  async  getUserById(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;

    try {
      const user = await this.userUseCase.getUserById(id);
      console.log(user)
      return res.status(200).json(user);
    } catch (error) {
      //console.log(error);
      return res.status(500).json({ error });
    }
  }

  async updatePassword(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const { password, newPassword } = req.body;

    try {
      const updatedPassword = await this.userUseCase.updatePassword(
        id,
        password,
        newPassword
      );

      return res.status(201).json(updatedPassword);
    } catch (error) {
      return res.status(500).json(error);
    }
  }

  async updateUser(req: Request, res: Response) {
    const name = req.body.name;
    const bio = req.body.bio;
    const site = req.body.site;
    const { id } = req.params;
    const picture = req.file?.filename;

    try {
      const updateUser = await this.userUseCase.updateUser({
        id,
        name,
        bio,
        picture,
        site,
      });

      return res.status(200).json(updateUser);
    } catch (error) {

      return res.status(400).json(error);
    }
  }

  async getUsers(req: Request, res: Response): Promise<Response> {
    try {
      const users = await this.userUseCase.getUsers();

      return res.status(200).json(users);
    } catch (error) {
      return res.status(400).json(error);
    }
  }

  async followUnfollow(req: Request, res: Response): Promise<Response> {
    const { followedId } = req.body;
    const followingId = req.user?.id;

    try {
      const follow = await this.userUseCase.followUnfollow(
        followingId,
        followedId
      );

      return res.status(201).json(follow);
    } catch (error) {
      return res.status(400).json(error);
    }
  }

  async getFollowings(req: Request, res: Response): Promise<Response> {
    try {
      const followings = await this.userUseCase.getFollowings(req.user?.id);

      return res.status(200).json(followings);
    } catch (error) {
      return res.status(400).json(error);
    }
  }

  async getFollowers(req: Request, res: Response): Promise<Response> {
    try {
      const followings = await this.userUseCase.getFollowers(req.user?.id);

      return res.status(200).json(followings);
    } catch (error) {
      return res.status(400).json(error);
    }
  }
} 