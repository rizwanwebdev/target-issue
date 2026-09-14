import jwt from "jsonwebtoken";
import config from "../config/config.js";

export default function jwtVerify(token, expectedType) {
  try {
    const decoded = jwt.verify(token, config.JWT_SECRET);

    if (decoded.type !== expectedType) {
      return {
        error: true,
        code: "INVALID_TOKEN_TYPE",
        message: "Invalid token type",
      };
    }

    return {
      error: false,
      ...decoded,
    };
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return {
        error: true,
        code: "TOKEN_EXPIRED",
        message: "Token has expired",
      };
    }

    if (error.name === "JsonWebTokenError") {
      return {
        error: true,
        code: "INVALID_TOKEN",
        message: "Invalid token",
      };
    }

    return {
      error: true,
      code: "JWT_VERIFICATION_FAILED",
      message: "Unable to verify token",
    };
  }
}
