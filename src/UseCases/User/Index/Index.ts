import Express from "express";
import prisma from "../../../PrismaClient/PrismaClient";

import { UserController } from "../../../Controller/User/UserController";
import { UserRepository } from "../../../Repository/UserRepository/UserRepository";
import UserRoutes from "../../../Routes/User/UserRoutes";
import { UserUseCase } from "../UserUseCase/UserUseCase";

const router = Express.Router();
const userRepository = new UserRepository(prisma);
const userUseCase = new UserUseCase(userRepository);
const userController = new UserController(userUseCase);
const userRoutes = new UserRoutes(userController, router);

export default userRoutes;
export { userUseCase, userRepository };
