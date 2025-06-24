import Joi from "joi";
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from "~/utils/validators";

const createNew = async (req, res, next) => {
  const condition = Joi.object({
    title: Joi.string().max(50).trim().strict().required(),
    load: Joi.number().min(0).required(),
    reps: Joi.number().min(0).required(),
  });
  try {
    await condition.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (error) {
    next(error);
  }
};

const updateWorkout = async (req, res, next) => {
  try {
    const condition = Joi.object({
      id: Joi.string()
        .required()
        .pattern(OBJECT_ID_RULE)
        .message(OBJECT_ID_RULE_MESSAGE),
      title: Joi.string().max(50).trim().strict().optional(),
      load: Joi.number().min(0).optional(),
      reps: Joi.number().min(0).optional(),
    });
    await condition.validateAsync(
      {
        id: req.params.id,
        title: req.body.title,
        load: req.body.load,
        reps: req.body.reps,
      },
      { abortEarly: false }
    );

    next();
  } catch (error) {
    next(error);
  }
};

const deleteWorkout = async (req, res, next) => {
  try {
    const condition = Joi.object({
      id: Joi.string()
        .required()
        .pattern(OBJECT_ID_RULE)
        .message(OBJECT_ID_RULE_MESSAGE),
    });
    await condition.validateAsync(
      {
        id: req.params.id,
      },
      { abortEarly: false }
    );

    next();
  } catch (error) {
    next(error);
  }
};

export const workoutValidation = {
  createNew,
  updateWorkout,
  deleteWorkout,
};
