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

const getAllPublic = async () => {
  try {
    const albumWorkouts = await albumnWorkoutModal.getAllPublic();
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

const getAlbum = async (id, userId) => {
  try {
    const albumWorkout = await albumnWorkoutModal.findOneById(id);
    if (
      albumWorkout.status === "Private" &&
      albumWorkout.userId.toString() !== userId
    ) {
      throw new Error("This album is not exist or private!");
    }
    return albumWorkout;
  } catch (error) {
    throw new Error(error);
  }
};

const updateDetails = async (id, details) => {
  try {
    const data = await albumnWorkoutModal.updateDetails(id, details);
    const albumWorkout = await albumnWorkoutModal.findOneById(data._id);
    return albumWorkout;
  } catch (error) {
    throw new Error(error);
  }
};

const getAlbumProfile = async (userIdProfile, userIdRequest) => {
  try {
    if (userIdProfile === userIdRequest) {
      const albumWorkouts = await albumnWorkoutModal.getAlbumWorkoutsAdmin(
        userIdRequest
      );
      return albumWorkouts;
    } else {
      const albumWorkouts =
        await albumnWorkoutModal.getAllPublicAlbumWorkoutsByUserId(
          userIdProfile
        );
      return albumWorkouts;
    }
  } catch (error) {
    throw new Error(error);
  }
};

export const albumnWorkoutService = {
  createNew,
  getAllPublic,
  updateAlbum,
  deleteAlbum,
  getAlbum,
  updateDetails,
  getAlbumProfile,
};
