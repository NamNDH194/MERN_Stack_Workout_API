import { StatusCodes } from "http-status-codes";
import { albumStorageService } from "~/services/albumStorageService";

const saveAlbum = async (req, res, next) => {
  try {
    const albumStorage = await albumStorageService.saveAlbum(
      req.userId,
      req.params.id,
      req.body.isSave
    );
    res.status(StatusCodes.CREATED).json(albumStorage);
  } catch (error) {
    next(error);
  }
};

const getAll = async (req, res, next) => {
  try {
    const albumStorages = await albumStorageService.getAll(req.userId);
    res.status(StatusCodes.OK).json(albumStorages);
  } catch (error) {
    next(error);
  }
};

export const albumStorageController = {
  saveAlbum,
  getAll,
};
