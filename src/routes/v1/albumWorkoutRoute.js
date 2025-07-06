import express from "express";
import { albumWorkoutValidation } from "~/validations/albumWorkoutValidation";
import { albumWorkoutController } from "~/controllers/albumWorkoutController";
import { authMiddleware } from "~/middlewares/authHandlingMiddleware";
import { albumLikeValidation } from "~/validations/albumLikeValidation";
import { albumLikeController } from "~/controllers/albumLikeController";

const Route = express.Router();

Route.use(authMiddleware);

Route.route("/sign-upload").post(albumWorkoutController.generateSignature);

Route.route("/")
  .post(albumWorkoutValidation.createNew, albumWorkoutController.createNew)
  .get(albumWorkoutController.getAllPublic);

Route.route("/:id")
  .put(albumWorkoutValidation.updateAlbum, albumWorkoutController.updateAlbum)
  .delete(
    albumWorkoutValidation.deleteAlbum,
    albumWorkoutController.deleteAlbum
  )
  .get(albumWorkoutValidation.getAlbum, albumWorkoutController.getAlbum);

Route.route("/like/:id").post(
  albumLikeValidation.likeAlbum,
  albumLikeController.likeAlbum
);

Route.route("/:id/details").put(
  albumWorkoutValidation.updateDetails,
  albumWorkoutController.updateDetails
);

export const albumWorkoutRoute = Route;
