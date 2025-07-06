import { albumContentModal } from "~/models/albumContentModal";
import { albumExerciseModal } from "~/models/albumExerciseModal";

const updateExercise = async (reqBody, exerciseId) => {
  try {
    const data = { ...reqBody };
    delete data.albumContentId;
    await albumExerciseModal.updateExercise(data, exerciseId);
    const albumContent = await albumContentModal.findOneById(
      reqBody.albumContentId
    );
    return albumContent;
  } catch (error) {
    throw new Error(error);
  }
};

const deleteExercise = async (exerciseId, albumContentId) => {
  try {
    await albumExerciseModal.deleteExercise(exerciseId);
    const albumContent = await albumContentModal.findOneById(albumContentId);
    return albumContent;
  } catch (error) {
    throw new Error(error);
  }
};

const createNew = async (reqBody) => {
  try {
    const albumContentId = reqBody.albumContentId;
    await albumExerciseModal.createNew(reqBody);
    const albumContent = await albumContentModal.findOneById(albumContentId);
    return albumContent;
  } catch (error) {
    throw new Error(error);
  }
};

export const albumExerciseService = {
  updateExercise,
  deleteExercise,
  createNew,
};
