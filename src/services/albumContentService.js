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

const getAll = async (albumWorkoutId) => {
  try {
    const albumContents = await albumContentModal.getAll(albumWorkoutId);
    return albumContents;
  } catch (error) {
    throw new Error(error);
  }
};

const updateAlbumContent = async (reqBody, albumContentId) => {
  try {
    const checkExist = await albumContentModal.findOneById(albumContentId);
    if (checkExist.length > 0) {
      const data = await albumContentModal.updateAlbumContent(
        reqBody,
        albumContentId
      );
      const albumContentUpdated = albumContentModal.findOneById(data._id);
      return albumContentUpdated;
    } else {
      throw new Error("This album content is not exist!");
    }
  } catch (error) {
    throw new Error(error);
  }
};

export const albumContentService = {
  createNew,
  getAll,
  updateAlbumContent,
};
