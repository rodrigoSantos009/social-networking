import { Router } from "express";
import { UserController } from "../../Controller/User/UserController";
import AuthMiddleware from "../../Middleware/AuthMiddleware";
import upload from "../../Config/Multer";

class UserRoutes {
  constructor(
    private userController: UserController,
    public router: Router
  ) {
    this.loadRoutes();
  }

  loadRoutes() {
    /* CREATE USER */
    this.router.post(
      "/user",  
      this.userController.handle.bind(this.userController)
    );
    /* AUTHENTICATE USER */
    this.router.post(
      "/login",
      this.userController.authenticate.bind(this.userController)
    );
    /* GET USER BY ID */
    this.router.get(
      "/user/:id",
      this.userController.getUserById.bind(this.userController)
    );
    /* UPDATE USER PASSWORD */
    this.router.patch(
      "/user/:id",
      AuthMiddleware,
      this.userController.updatePassword.bind(this.userController)
    );
    /* UPDATE USER INFORMATIONS */
    this.router.patch(
      "/update/:id",
      AuthMiddleware,
      upload.single("file"),
      this.userController.updateUser.bind(this.userController)
    );
    /* GET USERS */
    this.router.get(
      "/users",
      this.userController.getUsers.bind(this.userController)
    );
    /* FOLLOW OR UNFOLLOW A USER */
    this.router.post(
      "/user/follow/:idFollowing",
      AuthMiddleware,
      this.userController.followUnfollow.bind(this.userController)
    );
    /* GET FOLLOWINGS */
    this.router.get(
      "/followings",
      AuthMiddleware,
      this.userController.getFollowings.bind(this.userController)
    );
    /* GET FOLLOWERS */
    this.router.get(
      "/followers",
      AuthMiddleware,
      this.userController.getFollowers.bind(this.userController)
    );
  } 
}

export default UserRoutes;