import { StatusCodes } from "http-status-codes";
import { albumLikeService } from "~/services/albumLikeService";

const likeAlbum = async (req, res, next) => {
  try {
    const result = await albumLikeService.likeAlbum(
      req.params.id,
      req.userId,
      req.body.isLike
    );
    res.status(StatusCodes.CREATED).json(result);
  } catch (error) {
    next(error);
  }
};

export const albumLikeController = {
  likeAlbum,
};
