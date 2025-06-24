import { StatusCodes } from "http-status-codes";
import { workoutService } from "~/services/workoutService";

const getWorkoutNote = async (req, res, next) => {
  try {
    const workoutData = await workoutService.getWorkoutNote(req);

    res.status(StatusCodes.OK).json(workoutData);
  } catch (error) {
    next(error);
  }
};

const createNew = async (req, res, next) => {
  try {
    const createdWorkout = await workoutService.createNew(req.body, req.userId);
    res.status(StatusCodes.CREATED).json(createdWorkout);
  } catch (error) {
    next(error);
  }
};

const updateWorkout = async (req, res, next) => {
  try {
    const updatedWorkout = await workoutService.updateWorkout(
      req.params,
      req.body
    );
    res.status(StatusCodes.OK).json(updatedWorkout);
  } catch (error) {
    next(error);
  }
};

const deleteWorkout = async (req, res, next) => {
  try {
    const result = await workoutService.deleteWorkout(req.params.id);
    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};

export const workoutController = {
  getWorkoutNote,
  createNew,
  updateWorkout,
  deleteWorkout,
};
