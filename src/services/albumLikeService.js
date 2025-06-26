import { albumLikeModal } from "~/models/albumLikeModal";

const likeAlbum = async (albumWorkoutId, userId, isLike) => {
  try {
    const albumWorkout = await albumLikeModal.getAlbumById(albumWorkoutId);
    if (albumWorkout) {
      await albumLikeModal.likeAlbum(albumWorkoutId, userId, isLike);
      const result = await albumLikeModal.getAlbumById(albumWorkoutId);
      return result;
    } else {
      throw new Error("This album workout is not exist!");
    }
  } catch (error) {
    throw new Error(error);
  }
};

export const albumLikeService = {
  likeAlbum,
};
