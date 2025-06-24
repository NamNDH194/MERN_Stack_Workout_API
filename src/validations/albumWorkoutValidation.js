import Joi from "joi";
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from "~/utils/validators";

const createNew = async (req, res, next) => {
  try {
    const condition = Joi.object({
      title: Joi.string().required().min(1).max(50).trim().strict(),
      imgURL: Joi.string().required().min(1).trim().strict(),
      description: Joi.string().required().min(1).max(50).trim().strict(),
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
      description: Joi.string().optional().max(50).trim().strict(),
      status: Joi.string().required().valid("Public", "Private"),
      imgPublicId: Joi.string().optional(),
      oldImgPublicId: Joi.string().optional(),
    });
    await condition.validateAsync(req.body);

    next();
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

// const likeAlbum = async (req, res, next) => {
//   try {
//     const condition = Joi.object({
//       id: Joi.string()
//         .required()
//         .pattern(OBJECT_ID_RULE)
//         .message(OBJECT_ID_RULE_MESSAGE),
//       status: Joi.string().required().valid("increase", "decrease"),
//     });

//     await condition.validateAsync({
//       id: req.params.id,
//       status: req.body.status,
//     });

//     next();
//   } catch (error) {
//     next(error);
//   }
// };

export const albumWorkoutValidation = {
  createNew,
  updateAlbum,
  deleteAlbum,
  // likeAlbum,
};
