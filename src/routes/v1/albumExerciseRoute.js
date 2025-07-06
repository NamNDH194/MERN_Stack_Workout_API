import express from "express";
import { albumExerciseController } from "~/controllers/albumExerciseController";
import { authMiddleware } from "~/middlewares/authHandlingMiddleware";
import { albumExerciseValidation } from "~/validations/albumExerciseValidation";

const Route = express.Router();

Route.use(authMiddleware);

Route.route("/").post(
  albumExerciseValidation.createNew,
  albumExerciseController.createNew
);

Route.route("/:id")
  .put(
    albumExerciseValidation.updateExercise,
    albumExerciseController.updateExercise
  )
  .delete(
    albumExerciseValidation.deleteExercise,
    albumExerciseController.deleteExercise
  );

export const albumExerciseRoute = Route;
