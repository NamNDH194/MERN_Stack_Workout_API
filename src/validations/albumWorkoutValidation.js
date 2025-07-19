import Joi from "joi";
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from "~/utils/validators";

const createNew = async (req, res, next) => {
  try {
    const condition = Joi.object({
      title: Joi.string().required().min(1).max(50).trim().strict(),
      imgURL: Joi.string().required().min(1).trim().strict(),
      description: Joi.string().required().min(1).trim().strict(),
      status: Joi.string().required().valid("Public", "Private"),
      imgPublicId: Joi.string().required().min(1),
    });
    await condition.validateAsync(req.body);

    next();
  } catch (error) {
    next(error);
  }
};

const updateAlbum = async (req, res, next) => {
  try {
    const condition = Joi.object({
      title: Joi.string().optional().max(50).trim().strict(),
      imgURL: Joi.string().optional().trim().strict(),
      description: Joi.string().optional().trim().strict(),
      // status: Joi.string().required().valid("Public", "Private"),
      status: Joi.string().valid("Public", "Private").optional().empty(""),
      imgPublicId: Joi.string().optional(),
      oldImgPublicId: Joi.string().optional(),
    });
    if (Object.keys(condition).length === 0) {
      throw new Error("Please change at least one filed befor updating!");
    } else {
      await condition.validateAsync(req.body);
      next();
    }
  } catch (error) {
    next(error);
  }
};

const deleteAlbum = async (req, res, next) => {
  try {
    const condition = Joi.object({
      id: Joi.string()
        .required()
        .pattern(OBJECT_ID_RULE)
        .message(OBJECT_ID_RULE_MESSAGE),
      imgPublicId: Joi.string().required().min(1),
    });
    await condition.validateAsync({
      id: req.params.id,
      imgPublicId: req.body.imgPublicId,
    });

    next();
  } catch (error) {
    next(error);
  }
};

const getAlbum = async (req, res, next) => {
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

const updateDetails = async (req, res, next) => {
  try {
    const condition = Joi.object({
      id: Joi.string()
        .required()
        .pattern(OBJECT_ID_RULE)
        .message(OBJECT_ID_RULE_MESSAGE),
      details: Joi.object().required(),
    });
    await condition.validateAsync({
      id: req.params.id,
      details: req.body,
    });

    next();
  } catch (error) {
    next(error);
  }
};

export const albumWorkoutValidation = {
  createNew,
  updateAlbum,
  deleteAlbum,
  getAlbum,
  updateDetails,
};
