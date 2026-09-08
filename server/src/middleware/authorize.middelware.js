import jwt from "jsonwebtoken";
import config from "../config/config.js";
import pool from "../db/connect.js";

export default async function authorize(req, res, next) {
  const accessToken = req.cookies.accessToken;

  if (!accessToken) {
    return res
      .status(401)
      .json({ error: true, message: "Access Token not found" });
  }

  try {
    const decoded = jwt.verify(accessToken, config.JWT_SECRET);
    if (decoded.type !== "access") {
      return res
        .status(401)
        .json({ error: true, message: "Invalid Token Type" });
    }

    const result = await pool.query("SELECT id FROM users WHERE id=$1", [
      decoded.id,
    ]);

    if (result.rows.length === 0) {
      return res.status(401).json({
        error: true,
        message: "User not found",
      });
    }

    req.user = { id: decoded.id, sessionId: decoded.sessionId };
    next();
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

    return res.status(500).json({
      error: true,
      message: "Internal server error during authentication",
    });
  }
}
