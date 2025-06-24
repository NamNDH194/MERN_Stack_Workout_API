import { albumnWorkoutModal } from "~/models/albumWorkoutModal";
import { v2 as cloudinary } from "cloudinary";

const createNew = async (reqBody, userId) => {
  try {
    const data = await albumnWorkoutModal.createNew(reqBody, userId);
    const albumWKCreated = await albumnWorkoutModal.findOneById(
      data.insertedId
    );
    return albumWKCreated;
  } catch (error) {
    throw new Error(error);
  }
};

const getAll = async () => {
  try {
    const albumWorkouts = await albumnWorkoutModal.getAll();
    return albumWorkouts;
  } catch (error) {
    throw new Error(error);
  }
};

const updateAlbum = async (id, reqBody) => {
  try {
    if (reqBody.oldImgPublicId) {
      await cloudinary.uploader.destroy(reqBody.oldImgPublicId);
    }
    const data = await albumnWorkoutModal.updateAlbum(id, reqBody);
    const albumWorkout = await albumnWorkoutModal.findOneById(data._id);
    return albumWorkout;
  } catch (error) {
    throw new Error(error);
  }
};

const deleteAlbum = async (id, imgPublicId) => {
  try {
    await cloudinary.uploader.destroy(imgPublicId);
    const result = await albumnWorkoutModal.deleteAlbum(id);
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

// const likeAlbum = async (id, status, userId) => {
//   try {
//     await albumnWorkoutModal.likeAlbum(id, status, userId);
//     const albumWorkout = await albumnWorkoutModal.findOneById(id);
//     return albumWorkout;
//   } catch (error) {
//     throw new Error(error);
//   }
// };

export const albumnWorkoutService = {
  createNew,
  getAll,
  updateAlbum,
  deleteAlbum,
  // likeAlbum,
};
