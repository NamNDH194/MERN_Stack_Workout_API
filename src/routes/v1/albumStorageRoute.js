import express from "express";
import { albumStorageController } from "~/controllers/albumStorageController";
import { authMiddleware } from "~/middlewares/authHandlingMiddleware";
import { albumStorageValidation } from "~/validations/albumStorageValidation";

const Route = express.Router();
Route.use(authMiddleware);

Route.route("/:id").post(
  albumStorageValidation.saveAlbum,
  albumStorageController.saveAlbum
);

Route.route("/").get(
  albumStorageValidation.getAll,
  albumStorageController.getAll
);

export const albumStorageRoute = Route;
