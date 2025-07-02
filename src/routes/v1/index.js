import express from "express";
import { StatusCodes } from "http-status-codes";
import { workoutRoute } from "./workoutRoute";
import { usersRoute } from "./usersRoute";
import { albumWorkoutRoute } from "./albumWorkoutRoute";
import { albumContentRoute } from "./albumContentRoute";
import { albumExerciseRoute } from "./albumExerciseRoute";

const Route = express.Router();

Route.get("/status", (req, res) => {
  res.status(StatusCodes.OK).json({ messages: "OK" });
});

Route.use("/workout", workoutRoute);
Route.use("/user", usersRoute);
Route.use("/albumWorkout", albumWorkoutRoute);
Route.use("/albumContent", albumContentRoute);
Route.use("/albumExercise", albumExerciseRoute);

export const API_V1 = Route;
