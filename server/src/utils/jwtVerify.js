import jwt from "jsonwebtoken";
import config from "../config/config.js";

function jwtVerify(token, type) {
  try {
    const decoded = jwt.verify(accessToken, config.JWT_SECRET);
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
        message: "Token has expired",
      });
    } else if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        error: true,
        message: "Invalid token",
      });
    }
  }
}
export default jwtVerify;
