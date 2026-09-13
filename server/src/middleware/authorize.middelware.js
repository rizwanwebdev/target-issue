import config from "../config/config.js";
import pool from "../db/connect.js";
import jwtVerify from "../utils/jwtVerify.js";
export default async function authorize(req, res, next) {
  const accessToken = req.cookies.accessToken;

  const cookieOptions = {
    httpOnly: true,
    secure: config.NODE_ENV === "production",
    sameSite: "Strict",
    maxAge: 30 * 24 * 60 * 60 * 1000,
  };
  if (!accessToken) {
    return res
      .status(401)
      .json({ error: true, message: "Access Token not found" });
  }

  const decoded = jwtVerify(accessToken, "access");
  const result = await pool.query(
    "SELECT session_id, revoked_at  FROM refresh_token WHERE session_id=$1 AND (revoked_at IS NULL OR revoked_at > NOW()) AND (expires_at IS NULL OR expires_at > NOW())",
    [decoded.sessionId],
  );
  if (result.rows.length === 0) {
    res.clearCookie("accessToken", cookieOptions);
    res.clearCookie("refreshToken", {
      ...cookieOptions,
      maxAge: 15 * 60 * 1000,
    });
    return res
      .status(401)
      .json({ error: true, message: "Session Has been revoked. Login Again" });
  }

  req.user = { id: decoded.id, sessionId: decoded.sessionId };
  next();
}
