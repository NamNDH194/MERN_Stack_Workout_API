import Joi from "joi";
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from "~/utils/validators";

const saveAlbum = async (req, res, next) => {
  try {
    const condition = Joi.object({
      albumWorkoutId: Joi.string()
        .required()
        .pattern(OBJECT_ID_RULE)
        .message(OBJECT_ID_RULE_MESSAGE),
      userId: Joi.string()
        .required()
        .pattern(OBJECT_ID_RULE)
        .message(OBJECT_ID_RULE_MESSAGE),
      isSave: Joi.boolean().required(),
    });

    await condition.validateAsync({
      albumWorkoutId: req.params.id,
      userId: req.userId,
      isSave: req.body.isSave,
    });

    next();
  } catch (error) {
    next(error);
  }
};

const getAll = async (req, res, next) => {
  try {
    const condition = Joi.object({
      userId: Joi.string()
        .required()
        .pattern(OBJECT_ID_RULE)
        .message(OBJECT_ID_RULE_MESSAGE),
    });
    await condition.validateAsync({
      userId: req.userId,
    });

    next();
  } catch (error) {
    next(error);
  }
};

export const albumStorageValidation = {
  saveAlbum,
  getAll,
};
