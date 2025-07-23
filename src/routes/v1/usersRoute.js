import express from "express";
import { userController } from "~/controllers/userController";
import { authMiddleware } from "~/middlewares/authHandlingMiddleware";
import { userValidation } from "~/validations/userValidation";

const Route = express.Router();

Route.route("/signup").post(userValidation.signup, userController.signup);

Route.route("/login").post(userController.login);

Route.use(authMiddleware);

Route.route("/:userId")
  .get(userValidation.getUserById, userController.getUserById)
  .put(userValidation.updateUser, userController.updateUser);

Route.route("/:userId/changePassword").put(
  userValidation.changePassword,
  userController.changePassword
);

export const usersRoute = Route;
