import express from "express";
import { albumContentController } from "~/controllers/albumContentController";
import { authMiddleware } from "~/middlewares/authHandlingMiddleware";
import { albumContentValidation } from "~/validations/albumContentValidation";

const Route = express.Router();

Route.use(authMiddleware);
Route.route("/:id")
  .post(albumContentValidation.createNew, albumContentController.createNew)
  .get(albumContentController.getAll)
  .put(
    albumContentValidation.updateAlbumContent,
    albumContentController.updateAlbumContent
  )
  .delete(
    albumContentValidation.deleteAlbumContent,
    albumContentController.deleteAlbumContent
  );

Route.route("/startWorkout/:id").get(
  albumContentValidation.getAlbumContent,
  albumContentController.getAlbumContent
);

export const albumContentRoute = Route;
