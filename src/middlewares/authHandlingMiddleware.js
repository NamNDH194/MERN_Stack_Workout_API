import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import { env } from "~/config/environment";

export const authMiddleware = (req, res, next) => {
  const { authorization } = req.headers;
  if (authorization) {
    const token = authorization.split(" ")[1];
    try {
      const { _id } = jwt.verify(token, env.SECRET_STRING);
      req.userId = _id;
      next();
    } catch (error) {
      next(error);
    }
  } else {
    // return res
    //   .status(StatusCodes.UNAUTHORIZED)
    //   .json({ messages: "Error: Unauthorized" });
    const error = {
      statusCode: StatusCodes.UNAUTHORIZED,
      message: "Error: Unauthorized",
    };
    next(error);
  }
};
