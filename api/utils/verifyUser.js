import jwt from "jsonwebtoken";
import { errorHandler } from "./errorHandler.js";

/**
 * Here we wanna verify the token from the user before they can update their profile info.
 * so we make use of this function to secure the user routes the route
 */

export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) {
    return next(errorHandler(401, "Unauthorized"));
  }
  jwt.verify(token, process.env.JWT_SECRET, (error, user) => {
    if (err) {
      return next(401("Unauthorized"));
    }
    req.user = user;
    next();
    /**
     * if the token is valid, then we
     * wanna send the user req along with the body.
     */
  });
};
