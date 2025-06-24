import { workoutModal } from "~/models/workoutModel";

const getWorkoutNote = async (req) => {
  try {
    const workoutData = await workoutModal.getAll(req);
    return workoutData;
  } catch (error) {
    throw new Error(error);
  }
};

const createNew = async (reqBody, userId) => {
  try {
    const createdWorkoutId = await workoutModal.createNew(reqBody, userId);
    const createdWorkoutData = await workoutModal.findOneById(
      createdWorkoutId.insertedId
    );
    return createdWorkoutData;
  } catch (error) {
    throw new Error(error);
  }
};

const updateWorkout = async (id, reqBody) => {
  try {
    const updatedWorkout = await workoutModal.updateWorkout(id, reqBody);
    return updatedWorkout;
  } catch (error) {
    throw new Error(error);
  }
};

const deleteWorkout = async (id) => {
  try {
    const result = await workoutModal.deleteWorkout(id);
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

export const workoutService = {
  getWorkoutNote,
  createNew,
  updateWorkout,
  deleteWorkout,
};
