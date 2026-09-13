import jwt from "jsonwebtoken";
import config from "../config/config.js";
/**
 * @param {*} token jwt signed token
 * @param {*} type
 * @param {*} err
 * @returns decoded  jwt
 */
function jwtVerify(token, type, err = "Token has expired") {
  try {
    const decoded = jwt.verify(token, config.JWT_SECRET);
    if (decoded.type !== type) {
      return res
        .status(401)
        .json({ error: true, message: "Invalid Token Type" });
    }
    return decoded;
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        error: true,
        message: err,
      });
    } else if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        error: true,
        message: "Invalid Token",
      });
    }
  }
}
export default jwtVerify;
