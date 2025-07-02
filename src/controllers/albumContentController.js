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

export const albumContentController = {
  createNew,
};
