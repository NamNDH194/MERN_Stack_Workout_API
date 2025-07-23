import argon2 from "argon2";
import { ObjectId } from "mongodb";
import { GET_DB } from "~/config/mongodb";

const Joi = require("joi");
const {
  PASSWORD_RULE,
  PASSWORD_RULE_MESSAGE,
  // OBJECT_ID_RULE,
  // OBJECT_ID_RULE_MESSAGE,
} = require("~/utils/validators");

const USER_COLLECTION_NAME = "user";
const USER_COLLECTION_SCHEMA = Joi.object({
  userName: Joi.string().max(50).required(),
  email: Joi.string().required().email().trim().strict(),
  password: Joi.string()
    .required()
    .pattern(PASSWORD_RULE)
    .message(PASSWORD_RULE_MESSAGE),
  avatarImg: Joi.string().min(1).default(null),
  imgPublicId: Joi.string().min(1).default(null),
  // images: Joi.array().items(Joi.string().min(1)).default([]),
  // videos: Joi.array().items(Joi.string().min(1)).default([]),
  created: Joi.date().timestamp().default(Date.now),
  updated: Joi.date().timestamp().default(null),
  // albumWorkoutIds: Joi.array()
  //   .items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE))
  //   .default([]),
  // storage: Joi.array()
  //   .items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE))
  //   .default([]),
});

const findOne = async (email) => {
  try {
    const result = await GET_DB().collection(USER_COLLECTION_NAME).findOne({
      email: email,
    });
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const createNew = async (reqBody) => {
  try {
    const checkedData = await USER_COLLECTION_SCHEMA.validateAsync(reqBody);
    // checkedData.avatarImg =
    //   "https://res.cloudinary.com/ddbbrcjnh/image/upload/v1750499637/images/setkqiishlhvvqlmbhaz.png";
    const hash = await argon2.hash(checkedData.password, {
      type: argon2.argon2id,
    });
    checkedData.password = hash;
    const result = await GET_DB()
      .collection(USER_COLLECTION_NAME)
      .insertOne(checkedData);
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const findAccount = async (reqBody) => {
  try {
    const account = await GET_DB()
      .collection(USER_COLLECTION_NAME)
      .findOne({ email: reqBody.email });
    if (!account) {
      throw new Error("Email or password did not match!");
    }
    const isValidPassword = await argon2.verify(
      account.password,
      reqBody.password
    );
    if (isValidPassword) {
      const result = {
        _id: account._id,
        email: account.email,
        userName: account.userName,
        avatarImg: account.avatarImg,
      };
      return result;
    } else {
      throw new Error("Email or password did not match!");
    }
  } catch (error) {
    throw new Error(error);
  }
};

const findOneById = async (id) => {
  try {
    const account = await GET_DB()
      .collection(USER_COLLECTION_NAME)
      .findOne({ _id: new ObjectId(id) });
    return account;
  } catch (error) {
    throw new Error(error);
  }
};

const findOneByIdProfile = async (id) => {
  try {
    const account = await GET_DB()
      .collection(USER_COLLECTION_NAME)
      .findOne(
        { _id: new ObjectId(id) },
        {
          projection: {
            _id: 1,
            userName: 1,
            avatarImg: 1,
            imgPublicId: 1,
            created: 1,
          },
        }
      );
    return account;
  } catch (error) {
    throw new Error(error);
  }
};

const updateUser = async (userId, reqBody) => {
  try {
    if (reqBody.oldImgPublicId) {
      delete reqBody.oldImgPublicId;
    }
    reqBody.updatedAt = Date.now();
    const result = await GET_DB()
      .collection(USER_COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(userId) },
        { $set: reqBody },
        {
          returnDocument: "after",
          projection: {
            _id: 1,
            userName: 1,
            avatarImg: 1,
            imgPublicId: 1,
            created: 1,
          },
        }
      );
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const changePassword = async (userId, reqBody) => {
  try {
    const hash = await argon2.hash(reqBody.newPassword, {
      type: argon2.argon2id,
    });
    const hasedPassword = hash;
    const result = await GET_DB()
      .collection(USER_COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(userId) },
        { $set: { password: hasedPassword } },
        { returnDocument: "after" }
      );
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

export const userModal = {
  USER_COLLECTION_NAME,
  createNew,
  findOne,
  findAccount,
  findOneById,
  findOneByIdProfile,
  updateUser,
  changePassword,
};
