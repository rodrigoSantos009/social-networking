import Express from "express";
import prisma from "../../../PrismaClient/PrismaClient";

import { PostController } from "../../../Controller/Post/PostController/PostController";
import { PostRepository } from "../../../Repository/PostRepository/PostRepository";
import { PostRoutes } from "../../../Routes/Post/PostRoutes";
import { PostUseCase } from "../PostUseCase/PostUseCase";
import { userUseCase } from "../../User/Index/Index";

const router = Express.Router()
const postRepository = new PostRepository(prisma);
const postUseCase = new PostUseCase(postRepository, userUseCase);
const postController = new PostController(postUseCase);
const postRoutes = new PostRoutes(postController, router);

export default postRoutes;
export { postUseCase };