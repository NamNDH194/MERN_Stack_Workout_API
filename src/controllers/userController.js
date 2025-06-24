import { StatusCodes } from "http-status-codes";
import { userService } from "~/services/userService";

const signup = async (req, res, next) => {
  try {
    const result = await userService.signup(req.body);
    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const account = await userService.login(req.body);
    res.status(StatusCodes.OK).json(account);
  } catch (error) {
    next(error);
  }
};

export const userController = {
  signup,
  login,
};
