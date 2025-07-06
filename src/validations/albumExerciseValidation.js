import Joi from "joi";
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from "~/utils/validators";

const updateExercise = async (req, res, next) => {
  try {
    const condition = Joi.object({
      id: Joi.string()
        .required()
        .pattern(OBJECT_ID_RULE)
        .message(OBJECT_ID_RULE_MESSAGE),
      albumContentId: Joi.string()
        .required()
        .pattern(OBJECT_ID_RULE)
        .message(OBJECT_ID_RULE_MESSAGE),
      nameExercise: Joi.string().required().min(1).max(50).trim().strict(),
      setsExercise: Joi.number().required().min(0),
      repsExercise: Joi.number().required().min(0),
      timeExercise: Joi.number().required().min(0),
      detailedInstructions: Joi.string().required().min(1),
    });
    const checkedData = { ...req.body };
    checkedData.id = req.params.id;
    await condition.validateAsync(checkedData);

    next();
  } catch (error) {
    next(error);
  }
};

const deleteExercise = async (req, res, next) => {
  try {
    const condition = Joi.object({
      id: Joi.string()
        .required()
        .pattern(OBJECT_ID_RULE)
        .message(OBJECT_ID_RULE_MESSAGE),
      albumContentId: Joi.string()
        .required()
        .pattern(OBJECT_ID_RULE)
        .message(OBJECT_ID_RULE_MESSAGE),
    });

    const checkedData = {
      id: req.params.id,
      albumContentId: req.body.albumContentId,
    };
    await condition.validateAsync(checkedData);

    next();
  } catch (error) {
    next(error);
  }
};

const createNew = async (req, res, next) => {
  try {
    const condition = Joi.object({
      albumContentId: Joi.string()
        .required()
        .pattern(OBJECT_ID_RULE)
        .message(OBJECT_ID_RULE_MESSAGE),
      nameExercise: Joi.string().required().min(1).max(50).trim().strict(),
      setsExercise: Joi.number().required().min(0),
      repsExercise: Joi.number().required().min(0),
      timeExercise: Joi.number().optional().min(0),
      detailedInstructions: Joi.string().required().min(1),
    });
    await condition.validateAsync(req.body);

    next();
  } catch (error) {
    next(error);
  }
};

export const albumExerciseValidation = {
  updateExercise,
  deleteExercise,
  createNew,
};
