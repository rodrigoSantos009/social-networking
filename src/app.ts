import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import userRoutes from "./UseCases/User/Index/Index";
import postRoutes from "./UseCases/Post/Index/Index";

const app = express();
app.use(express.json());
app.use(bodyParser.json())
app.use(cors());
app.use(userRoutes.router);
app.use(postRoutes.router);

export default app;