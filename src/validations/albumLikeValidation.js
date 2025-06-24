import Joi from "joi";
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from "~/utils/validators";

const likeAlbum = async (req, res, next) => {
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
      isLike: Joi.boolean().required(),
    });

    await condition.validateAsync({
      albumWorkoutId: req.params.id,
      userId: req.userId,
      isLike: req.body.isLike,
    });

    next();
  } catch (error) {
    next(error);
  }
};

export const albumLikeValidation = {
  likeAlbum,
};
