import express from "express";
import { workoutController } from "~/controllers/workoutController";
import { authMiddleware } from "~/middlewares/authHandlingMiddleware";
import { workoutValidation } from "~/validations/workoutValidation";

const Route = express.Router();

Route.use(authMiddleware);

Route.route("/")
  .get(workoutController.getWorkoutNote)
  .post(workoutValidation.createNew, workoutController.createNew);

Route.route("/:id")
  .put(workoutValidation.updateWorkout, workoutController.updateWorkout)
  .delete(workoutValidation.deleteWorkout, workoutController.deleteWorkout);
export const workoutRoute = Route;
