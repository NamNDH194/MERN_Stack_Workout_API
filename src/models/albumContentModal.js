import Joi from "joi";
import { ObjectId, ReturnDocument } from "mongodb";
import { GET_DB } from "~/config/mongodb";
import { albumnWorkoutModal } from "./albumWorkoutModal";
import { albumExerciseModal } from "./albumExerciseModal";

const ALBUM_CONTENT_COLLECTION_NAME = "album-workout-content";
const ALBUM_CONTENT_COLLECTION_SCHEMA = Joi.object({
  albumContentName: Joi.string().required().min(1).max(50).trim().strict(),
  description: Joi.string().required().min(1),
  exercises: Joi.array()
    .required()
    .items(
      Joi.object({
        nameExercise: Joi.string().required().min(1).max(50).trim().strict(),
        repsExercise: Joi.number().required().min(0),
        setsExercise: Joi.number().required().min(0),
        timeExercise: Joi.number().optional().min(0),
        detailedInstructions: Joi.string().required().min(1),
      })
    ),
  createdAt: Joi.date().timestamp("javascript").default(Date.now),
  updatedAt: Joi.date().timestamp("javascript").default(null),
});

const findAlbumWorkoutById = async (id) => {
  try {
    const result = await GET_DB()
      .collection(albumnWorkoutModal.ALBUM_WORKOUT_COLLECTION_NAME)
      .findOne({ _id: new ObjectId(id) });
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const createNew = async (reqBody, albumWorkoutId) => {
  try {
    const checkedData = await ALBUM_CONTENT_COLLECTION_SCHEMA.validateAsync(
      reqBody
    );
    const exercises = [...checkedData.exercises];
    checkedData.albumWorkoutId = new ObjectId(albumWorkoutId);
    delete checkedData.exercises;
    const albumContent = { ...checkedData };
    const resultAlbumContent = await GET_DB()
      .collection(ALBUM_CONTENT_COLLECTION_NAME)
      .insertOne(albumContent);
    const exercisesToInsert = exercises.map((item) => ({
      albumContentId: new ObjectId(resultAlbumContent.insertedId),
      ...item,
      createdAt: Date.now(),
      updatedAt: null,
    }));
    await GET_DB()
      .collection(albumExerciseModal.ALBUM_EXERCISE_COLLECTION_NAME)
      .insertMany(exercisesToInsert);
    return resultAlbumContent;
  } catch (error) {
    throw new Error(error);
  }
};

const findOneById = async (id) => {
  try {
    const result = await GET_DB()
      .collection(ALBUM_CONTENT_COLLECTION_NAME)
      .aggregate([
        { $match: { _id: new ObjectId(id) } },
        {
          $lookup: {
            from: albumExerciseModal.ALBUM_EXERCISE_COLLECTION_NAME,
            localField: "_id",
            foreignField: "albumContentId",
            as: "exercises",
          },
        },
      ])
      .toArray();
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const getAll = async (albumWorkoutId) => {
  try {
    const result = await GET_DB()
      .collection(ALBUM_CONTENT_COLLECTION_NAME)
      .aggregate([
        {
          $match: {
            albumWorkoutId: new ObjectId(albumWorkoutId),
          },
        },
        {
          $lookup: {
            from: albumExerciseModal.ALBUM_EXERCISE_COLLECTION_NAME,
            localField: "_id",
            foreignField: "albumContentId",
            as: "exercises",
          },
        },
        { $sort: { createdAt: -1 } },
      ])
      .toArray();
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const updateAlbumContent = async (reqBody, albumContentId) => {
  try {
    const result = await GET_DB()
      .collection(ALBUM_CONTENT_COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(albumContentId) },
        {
          $set: reqBody,
        },
        { returnDocument: "after" }
      );
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const deleteAlbumContent = async (albumContentId) => {
  try {
    const result = await GET_DB()
      .collection(ALBUM_CONTENT_COLLECTION_NAME)
      .findOneAndDelete({ _id: new ObjectId(albumContentId) });
    await GET_DB()
      .collection(albumExerciseModal.ALBUM_EXERCISE_COLLECTION_NAME)
      .deleteMany({ albumContentId: new ObjectId(albumContentId) });
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

export const albumContentModal = {
  findAlbumWorkoutById,
  createNew,
  findOneById,
  getAll,
  updateAlbumContent,
  deleteAlbumContent,
};
