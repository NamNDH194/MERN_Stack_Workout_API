import Joi from "joi";
import {
  OBJECT_ID_RULE,
  OBJECT_ID_RULE_MESSAGE,
  PASSWORD_RULE,
  PASSWORD_RULE_MESSAGE,
} from "~/utils/validators";

const signup = async (req, res, next) => {
  try {
    const condition = Joi.object({
      userName: Joi.string().required(),
      email: Joi.string().required().email().trim().strict(),
      password: Joi.string()
        .required()
        .pattern(PASSWORD_RULE)
        .message(PASSWORD_RULE_MESSAGE),
    });
    await condition.validateAsync(req.body, { abortEarly: false });

    next();
  } catch (error) {
    next(error);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const condition = Joi.object({
      userId: Joi.string()
        .required()
        .pattern(OBJECT_ID_RULE)
        .message(OBJECT_ID_RULE_MESSAGE),
    });
    await condition.validateAsync({ userId: req.params.userId });

    next();
  } catch (error) {
    next(error);
  }
};

export const userValidation = {
  signup,
  getUserById,
};
