import express from "express";
import { userController } from "~/controllers/userController";
import { userValidation } from "~/validations/userValidation";

const Route = express.Router();

Route.route("/signup").post(userValidation.signup, userController.signup);

Route.route("/login").post(userController.login);

export const usersRoute = Route;
