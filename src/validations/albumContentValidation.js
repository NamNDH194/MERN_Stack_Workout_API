import Joi from "joi";
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from "~/utils/validators";

const createNew = async (req, res, next) => {
  try {
    const condition = Joi.object({
      albumContentName: Joi.string().required().min(1).max(50).trim().strict(),
      description: Joi.string().required().min(1),
      exercises: Joi.array()
        .required()
        .items(
          Joi.object({
            nameExercise: Joi.string()
              .required()
              .min(1)
              .max(50)
              .trim()
              .strict(),
            repsExercise: Joi.number().required().min(0),
            setsExercise: Joi.number().required().min(0),
            timeExercise: Joi.number().optional().min(0),
            detailedInstructions: Joi.string().required().min(1),
          })
        ),
    });
    await condition.validateAsync(req.body);

    next();
  } catch (error) {
    next(error);
  }
};

const updateAlbumContent = async (req, res, next) => {
  try {
    const condition = Joi.object({
      id: Joi.string()
        .required()
        .pattern(OBJECT_ID_RULE)
        .message(OBJECT_ID_RULE_MESSAGE),
      albumContentName: Joi.string().required().min(1).max(50).trim().strict(),
      description: Joi.string().required().min(1),
    });
    const checkedData = req.body;
    checkedData.id = req.params.id;
    await condition.validateAsync(checkedData, { abortEarly: false });

    next();
  } catch (error) {
    next(error);
  }
};

const deleteAlbumContent = async (req, res, next) => {
  try {
    const condition = Joi.object({
      id: Joi.string()
        .required()
        .pattern(OBJECT_ID_RULE)
        .message(OBJECT_ID_RULE_MESSAGE),
    });
    await condition.validateAsync(req.params);

    next();
  } catch (error) {
    next(error);
  }
};

export const albumContentValidation = {
  createNew,
  updateAlbumContent,
  deleteAlbumContent,
};
