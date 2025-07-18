import { albumLikeModal } from "~/models/albumLikeModal";
import { albumStorageModal } from "~/models/albumStorageModal";

const saveAlbum = async (userId, albumWorkoutId, isSave) => {
  try {
    const albumWorkout = await albumLikeModal.findAlbumById(albumWorkoutId);
    if (albumWorkout) {
      await albumStorageModal.saveAlbum(userId, albumWorkoutId, isSave);
      const result = await albumLikeModal.getAlbumById(albumWorkoutId);
      return result;
    } else {
      throw new Error("This album workout is not exist!");
    }
  } catch (error) {
    throw new Error(error);
  }
};

const getAll = async (userId) => {
  try {
    const albumStorages = albumStorageModal.getAll(userId);
    return albumStorages;
  } catch (error) {
    throw new Error(error);
  }
};

export const albumStorageService = {
  saveAlbum,
  getAll,
};
