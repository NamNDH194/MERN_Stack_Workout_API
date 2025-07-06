import { StatusCodes } from "http-status-codes";
import { albumExerciseService } from "~/services/albumExerciseService";

const updateExercise = async (req, res, next) => {
  try {
    const exerciseUpdated = await albumExerciseService.updateExercise(
      req.body,
      req.params.id
    );
    res.status(StatusCodes.OK).json(exerciseUpdated);
  } catch (error) {
    next(error);
  }
};

const deleteExercise = async (req, res, next) => {
  try {
    const result = await albumExerciseService.deleteExercise(
      req.params.id,
      req.body.albumContentId
    );
    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};

const createNew = async (req, res, next) => {
  try {
    const result = await albumExerciseService.createNew(req.body);
    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};

export const albumExerciseController = {
  updateExercise,
  deleteExercise,
  createNew,
};
