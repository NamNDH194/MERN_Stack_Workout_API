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

const updateUser = async (req, res, next) => {
  try {
    const condition = Joi.object({
      userId: Joi.string()
        .required()
        .pattern(OBJECT_ID_RULE)
        .message(OBJECT_ID_RULE_MESSAGE),
      userName: Joi.string().optional().min(1).trim().strict(),
      avatarImg: Joi.string().optional().min(1),
      imgPublicId: Joi.string().optional(),
      oldImgPublicId: Joi.string().optional().empty(""),
    });
    if (Object.keys(condition).length === 0) {
      throw new Error("Please change at least one filed befor updating!");
    } else {
      await condition.validateAsync({
        userId: req.params.userId,
        userName: req.body.userName,
        avatarImg: req.body.avatarImg,
        imgPublicId: req.body.imgPublicId,
        oldImgPublicId: req.body.oldImgPublicId,
      });

      next();
    }
  } catch (error) {
    next(error);
  }
};

const changePassword = async (req, res, next) => {
  try {
    const condition = Joi.object({
      userId: Joi.string()
        .required()
        .pattern(OBJECT_ID_RULE)
        .message(OBJECT_ID_RULE_MESSAGE),
      newPassword: Joi.string()
        .required()
        .pattern(PASSWORD_RULE)
        .message(PASSWORD_RULE_MESSAGE),
      oldPassword: Joi.string().required().min(1),
      // .pattern(PASSWORD_RULE)
      // .message(PASSWORD_RULE_MESSAGE),
    });
    await condition.validateAsync({
      userId: req.params.userId,
      newPassword: req.body.newPassword,
      oldPassword: req.body.oldPassword,
    });

    next();
  } catch (error) {
    next(error);
  }
};

export const userValidation = {
  signup,
  getUserById,
  updateUser,
  changePassword,
};
