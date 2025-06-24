import { albumLikeModal } from "~/models/albumLikeModal";

const likeAlbum = async (albumWorkoutId, userId, isLike) => {
  try {
    await albumLikeModal.likeAlbum(albumWorkoutId, userId, isLike);
    const result = await albumLikeModal.getAlbumById(albumWorkoutId);
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

export const albumLikeService = {
  likeAlbum,
};
