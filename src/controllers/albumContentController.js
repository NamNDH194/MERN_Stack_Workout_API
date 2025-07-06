import { StatusCodes } from "http-status-codes";
import { albumContentService } from "~/services/albumContentService";

const createNew = async (req, res, next) => {
  try {
    const albumContentCreated = await albumContentService.createNew(
      req.body,
      req.params.id
    );
    res.status(StatusCodes.CREATED).json(albumContentCreated);
  } catch (error) {
    next(error);
  }
};

const getAll = async (req, res, next) => {
  try {
    const albumContents = await albumContentService.getAll(req.params.id);
    res.status(StatusCodes.OK).json(albumContents);
  } catch (error) {
    next(error);
  }
};

const updateAlbumContent = async (req, res, next) => {
  try {
    delete req.body.id;
    const albumContentUpdated = await albumContentService.updateAlbumContent(
      req.body,
      req.params.id
    );
    res.status(StatusCodes.OK).json(albumContentUpdated);
  } catch (error) {
    next(error);
  }
};

const deleteAlbumContent = async (req, res, next) => {
  try {
    const result = await albumContentService.deleteAlbumContent(req.params.id);
    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};

export const albumContentController = {
  createNew,
  getAll,
  updateAlbumContent,
  deleteAlbumContent,
};
