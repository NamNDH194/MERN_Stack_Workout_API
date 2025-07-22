import { ObjectId } from "mongodb";
import { GET_DB } from "~/config/mongodb";

const ALBUM_EXERCISE_COLLECTION_NAME = "album-workout-exercises";

const updateExercise = async (data, exerciseId) => {
  try {
    data.updatedAt = Date.now();
    const result = await GET_DB()
      .collection(ALBUM_EXERCISE_COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(exerciseId) },
        {
          $set: data,
        },
        {
          returnDocument: "after",
        }
      );
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const deleteExercise = async (exerciseId) => {
  try {
    const result = await GET_DB()
      .collection(ALBUM_EXERCISE_COLLECTION_NAME)
      .findOneAndDelete({ _id: new ObjectId(exerciseId) });
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const createNew = async (reqBody) => {
  try {
    reqBody.albumContentId = new ObjectId(reqBody.albumContentId);
    reqBody.createdAt = Date.now();
    reqBody.updatedAt = null;
    const result = await GET_DB()
      .collection(ALBUM_EXERCISE_COLLECTION_NAME)
      .insertOne(reqBody);
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

export const albumExerciseModal = {
  ALBUM_EXERCISE_COLLECTION_NAME,
  updateExercise,
  deleteExercise,
  createNew,
};
