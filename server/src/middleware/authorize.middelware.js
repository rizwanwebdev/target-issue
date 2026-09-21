import pool from "../db/connect.js";
import jwtVerify from "../utils/jwtVerify.js";

export default async function authorize(req, res, next) {
  const accessToken = req.cookies.accessToken;

  if (!accessToken) {
    return res.status(401).json({
      error: true,
      code: "NO_ACCESS_TOKEN",
      message: "Access token not found",
    });
  }

  const decoded = jwtVerify(accessToken, "access");

  if (decoded.error) {
    return res.status(401).json({
      error: true,
      code: decoded.code,
      message: decoded.message,
    });
  }

  try {
    const result = await pool.query(
      `
      SELECT session_id
      FROM session
      WHERE session_id = $1
        AND user_id = $2
        AND is_active = TRUE
        AND (
          expires_at IS NULL
          OR expires_at > NOW()
        )
      `,
      [decoded.sessionId, decoded.id],
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        error: true,
        code: "SESSION_REVOKED",
        message: "Session is no longer active",
      });
    }

    req.user = {
      id: decoded.id,
      sessionId: decoded.sessionId,
    };
    console.log(
      {
        USER_ID: decoded.id,
        SESSION_ID: decoded.sessionId,
      },
      "--------------------",
    );

    next();
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }
}
