import Joi from "joi";
import { ObjectId } from "mongodb";
import { GET_DB } from "~/config/mongodb";

const WORKOUT_COLLECTION_NAME = "workout";

const WORKOUT_COLLECTION_SCHEMA = Joi.object({
  title: Joi.string().required().max(50).trim().strict(),
  load: Joi.number().required().min(0),
  reps: Joi.number().required().min(0),
  created: Joi.date().timestamp().default(Date.now),
  updated: Joi.date().timestamp().default(null),
});

const createNew = async (reqBody, userId) => {
  try {
    const checkedData = await WORKOUT_COLLECTION_SCHEMA.validateAsync(reqBody);
    checkedData.userId = new ObjectId(userId);
    const createdWorkout = await GET_DB()
      .collection(WORKOUT_COLLECTION_NAME)
      .insertOne(checkedData);
    return createdWorkout;
  } catch (error) {
    throw new Error(error);
  }
};

const findOneById = async (id) => {
  try {
    const result = await GET_DB()
      .collection(WORKOUT_COLLECTION_NAME)
      .find({ _id: new ObjectId(id) })
      .toArray();
    return result[0];
  } catch (error) {
    throw new Error(error);
  }
};

const getAll = async (req) => {
  try {
    const result = await GET_DB()
      .collection(WORKOUT_COLLECTION_NAME)
      .aggregate([
        { $match: { userId: new ObjectId(req.userId) } },
        { $sort: { created: -1 } },
      ])
      .toArray();
    return result;
  } catch (error) {
    throw new Error(error.message || "Failed to fetch data");
  }
};

const updateWorkout = async (workoutId, workoutBody) => {
  try {
    workoutBody.updated = Date.now();
    const result = await GET_DB()
      .collection(WORKOUT_COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(workoutId) },
        { $set: workoutBody },
        { returnDocument: "after" }
      );
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const deleteWorkout = async (id) => {
  try {
    const result = await GET_DB()
      .collection(WORKOUT_COLLECTION_NAME)
      .findOneAndDelete({ _id: new ObjectId(id) });
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

export const workoutModal = {
  createNew,
  getAll,
  updateWorkout,
  deleteWorkout,
  findOneById,
};
