import Joi from "joi";

const createNew = async (req, res, next) => {
  try {
    const condition = Joi.object({
      albumContentName: Joi.string().required().min(1).max(50).trim().strict(),
      description: Joi.string().required().min(1).trim().strict(),
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
            detailedInstructions: Joi.string()
              .required()
              .min(1)
              .trim()
              .strict(),
          })
        ),
    });
    await condition.validateAsync(req.body);

    next();
  } catch (error) {
    next(error);
  }
};

export const albumContentValidation = {
  createNew,
};
