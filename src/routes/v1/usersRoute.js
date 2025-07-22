import express from "express";
import { userController } from "~/controllers/userController";
import { authMiddleware } from "~/middlewares/authHandlingMiddleware";
import { userValidation } from "~/validations/userValidation";

const Route = express.Router();

Route.route("/signup").post(userValidation.signup, userController.signup);

Route.route("/login").post(userController.login);

Route.use(authMiddleware);

Route.route("/:userId").get(
  userValidation.getUserById,
  userController.getUserById
);

export const usersRoute = Route;
