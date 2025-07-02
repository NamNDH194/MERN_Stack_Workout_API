import express from "express";
import { albumExerciseController } from "~/controllers/albumExerciseController";
import { albumExerciseValidation } from "~/validations/albumExerciseValidation";

const Route = express.Router();

Route.route("/")
  .post
  //   albumExerciseValidation.createNew,
  //   albumExerciseController.createNew
  ();

export const albumExerciseRoute = Route;
