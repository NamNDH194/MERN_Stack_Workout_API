import Joi from "joi";
import { PASSWORD_RULE, PASSWORD_RULE_MESSAGE } from "~/utils/validators";

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

export const userValidation = {
  signup,
};
