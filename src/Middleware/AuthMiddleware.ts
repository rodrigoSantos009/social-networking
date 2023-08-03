import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { userUseCase } from "../UseCases/User/Index/Index";

type JWTPayload = {
  email: string;
};

async function AuthMiddleware(req: Request, res: Response, next: NextFunction) {
  const { authorization } = req.headers;
  if(!authorization) {
    return res.status(401).json({
      message: "Token is Missing!"
    });
  }
  const token = authorization?.split(" ")[1];

 try {
  const { email } = jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET ?? ""
  ) as JWTPayload;

  const user = await userUseCase.getUserByEmail(email);
  if(!user) throw new Error("Unauthorized");

  const { password: _, ...loggedUser } = user;

  req.user = loggedUser;

  next();
  
 } catch (error) {
  return res.status(401).json({
    message: error + "Token Invalid!"
  })
 }
}

export default AuthMiddleware;