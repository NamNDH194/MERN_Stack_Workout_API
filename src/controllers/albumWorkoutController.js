import { StatusCodes } from "http-status-codes";
import { v2 as cloudinary } from "cloudinary";
import { env } from "~/config/environment";
import { albumnWorkoutService } from "~/services/albumWorkoutService";

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_CLOUD_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
  secure: true,
});

const generateSignature = async (req, res, next) => {
  const { folder } = req.body;
  try {
    if (!req.body) {
      throw new Error("Folder is required!");
    } else {
      // const timestamp = Math.round(new Date().getTime() / 1000);
      const timestamp = Math.floor(Date.now() / 1000);
      const signature = cloudinary.utils.api_sign_request(
        {
          timestamp,
          folder,
        },
        env.CLOUDINARY_API_SECRET
      );
      res.status(StatusCodes.OK).json({ timestamp, signature });
    }
  } catch (error) {
    next(error);
  }
};

const createNew = async (req, res, next) => {
  try {
    const albumWKCreated = await albumnWorkoutService.createNew(
      req.body,
      req.userId
    );
    res.status(StatusCodes.CREATED).json(albumWKCreated);
  } catch (error) {
    next(error);
  }
};

const getAllPublic = async (req, res, next) => {
  try {
    const albumWorkouts = await albumnWorkoutService.getAllPublic();
    res.status(StatusCodes.OK).json(albumWorkouts);
  } catch (error) {
    next(error);
  }
};

const updateAlbum = async (req, res, next) => {
  try {
    const albumWorkout = await albumnWorkoutService.updateAlbum(
      req.params,
      req.body
    );
    res.status(StatusCodes.OK).json(albumWorkout);
  } catch (error) {
    next(error);
  }
};

const deleteAlbum = async (req, res, next) => {
  try {
    const result = await albumnWorkoutService.deleteAlbum(
      req.params.id,
      req.body.imgPublicId
    );
    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};

const getAlbum = async (req, res, next) => {
  try {
    const albumWorkout = await albumnWorkoutService.getAlbum(
      req.params.id,
      req.userId
    );
    res.status(StatusCodes.OK).json(albumWorkout);
  } catch (error) {
    next(error);
  }
};

const updateDetails = async (req, res, next) => {
  try {
    const albumWorkout = await albumnWorkoutService.updateDetails(
      req.params.id,
      req.body
    );
    res.status(StatusCodes.OK).json(albumWorkout);
  } catch (error) {
    next(error);
  }
};

const getAlbumProfile = async (req, res, next) => {
  try {
    const albumWorkouts = await albumnWorkoutService.getAlbumProfile(
      req.params.userIdProfile,
      req.userId
    );
    res.status(StatusCodes.OK).json(albumWorkouts);
  } catch (error) {
    next(error);
  }
};

export const albumWorkoutController = {
  generateSignature,
  createNew,
  getAllPublic,
  updateAlbum,
  deleteAlbum,
  getAlbum,
  updateDetails,
  getAlbumProfile,
};
