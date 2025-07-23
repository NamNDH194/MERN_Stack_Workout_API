import { userModal } from "~/models/userModal";
import jwt from "jsonwebtoken";
import { env } from "~/config/environment";
import { v2 as cloudinary } from "cloudinary";
import argon2 from "argon2";

const createToken = (id) => {
  return jwt.sign({ _id: id }, env.SECRET_STRING, {
    expiresIn: "1d",
  });
};

const signup = async (reqBody) => {
  try {
    const checkExist = await userModal.findOne(reqBody.email);
    if (checkExist) {
      throw new Error("Email is exist!");
    } else {
      const data = await userModal.createNew(reqBody);
      const account = await userModal.findOneById(data.insertedId);
      const token = createToken(account._id);
      return {
        // userId: account._id,
        email: account.email,
        userName: account.userName,
        avatarImg: account.avatarImg,
        token: token,
      };
    }
  } catch (error) {
    throw new Error(error);
  }
};

const login = async (reqBody) => {
  try {
    const account = await userModal.findAccount(reqBody);
    const token = createToken(account._id);
    return {
      // userId: account._id,
      email: account.email,
      userName: account.userName,
      avatarImg: account.avatarImg,
      token: token,
    };
  } catch (error) {
    throw new Error(error);
  }
};

const getUserById = async (userId) => {
  try {
    const account = await userModal.findOneByIdProfile(userId);
    return account;
  } catch (error) {
    throw new Error(error);
  }
};

const updateUser = async (userId, reqBody) => {
  try {
    if (reqBody.oldImgPublicId) {
      await cloudinary.uploader.destroy(reqBody.oldImgPublicId);
    }
    const accountUpdated = await userModal.updateUser(userId, reqBody);
    return accountUpdated;
  } catch (error) {
    throw new Error(error);
  }
};

const changePassword = async (userId, reqBody) => {
  try {
    const user = await userModal.findOneById(userId);
    const isValidPassword = await argon2.verify(
      user?.password,
      reqBody.oldPassword
    );
    if (isValidPassword) {
      const account = await userModal.changePassword(userId, reqBody);
      return account;
    } else {
      throw new Error("Wrong password!");
    }
  } catch (error) {
    throw new Error(error);
  }
};

export const userService = {
  signup,
  login,
  getUserById,
  updateUser,
  changePassword,
};
