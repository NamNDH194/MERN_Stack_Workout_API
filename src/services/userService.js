import { userModal } from "~/models/userModal";
import jwt from "jsonwebtoken";
import { env } from "~/config/environment";

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

export const userService = {
  signup,
  login,
  getUserById,
};
