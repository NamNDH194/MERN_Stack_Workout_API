import { albumContentModal } from "~/models/albumContentModal";

const createNew = async (reqBody, albumWorkoutId) => {
  try {
    const albumWorkout = await albumContentModal.findAlbumWorkoutById(
      albumWorkoutId
    );
    if (albumWorkout) {
      const data = await albumContentModal.createNew(reqBody, albumWorkoutId);
      const albumContentCreated = await albumContentModal.findOneById(
        data.insertedId
      );
      return albumContentCreated;
    } else {
      throw new Error("Album workout is not exist!");
    }
  } catch (error) {
    throw new Error(error);
  }
};

export const albumContentService = {
  createNew,
};
