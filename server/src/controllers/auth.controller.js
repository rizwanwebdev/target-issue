import pool from "../db/connect.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "../config/config.js";
import { otpTemplate, passwordResetOtpTemplate } from "../utils/email.util.js";
import jwtVerify from "../utils/jwtVerify.js";
import useragent from "express-useragent";
import crypto from "crypto";
function genrateOTP() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

const cookieOptions = {
  httpOnly: true,
  secure: config.NODE_ENV === "production",
  sameSite: "Strict",
  maxAge: 30 * 24 * 60 * 60 * 1000,
};

function genAccessToken(id, sessionId) {
  return jwt.sign({ id, sessionId, type: "access" }, config.JWT_SECRET, {
    expiresIn: "15m",
  });
}

function genRefreshToken(id, sessionId) {
  return jwt.sign({ id, sessionId, type: "refresh" }, config.JWT_SECRET, {
    expiresIn: "30d",
  });
}

/**
 * @method POST /register
 * @prop { name, email, password }
 * @param {*} req
 * @param {*} res
 */
const EMAILREGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const USERNAME_FORMAT = /^[a-z0-9_]{4,25}$/;
const STRONGPASSOWRDREGX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export async function register(req, res) {
  try {
    const { name, username, email, password } = req.body;

    if (!name || !username || !email || !password) {
      return res.status(400).json({
        error: true,
        message: "name,username, email and password are required",
      });
    }
    if (name.length < 4) {
      return res.status(400).json({
        error: true,
        message: "Name is less than 4 chracters",
      });
    }
    if (!USERNAME_FORMAT.test(username)) {
      return res.status(400).json({
        error: true,
        message:
          "Username must be 4–25 characters and contain only lowercase letters, numbers, and underscores.",
      });
    }
    if (!EMAILREGEX.test(email)) {
      return res.status(400).json({
        error: true,
        message: "Invalid email",
      });
    }

    if (!STRONGPASSOWRDREGX.test(password)) {
      return res.status(400).json({
        error: true,
        message:
          "Password must be at least 8 characters with special symbols like @$!%*?&",
      });
    }

    const user = await pool.query("SELECT email FROM users WHERE email=$1", [
      email,
    ]);
    if (user.rows.length > 0) {
      return res
        .status(400)
        .json({ error: true, message: "User with this email already exists" });
    }

    const passHash = await bcrypt.hash(password, 10);
    const result = await pool.query(
      "INSERT INTO users (full_name,username, email, password_hash) VALUES ($1, $2, $3, $4) RETURNING id",
      [name, username, email, passHash],
    );

    const otp = genrateOTP();
    console.log(otp, "------------------");
    const otpHash = await bcrypt.hash(otp, 10);
    const verificationToken = crypto.randomUUID();

    await pool.query(
      "INSERT INTO otp_verification (otp_id, user_id, email, otp_hash, expires_at) VALUES ($1, $2, $3, $4, NOW() + INTERVAL '5 minutes')",
      [verificationToken, result.rows[0].id, email, otpHash],
    );

    // await otpTemplate(email, otp, verificationToken);

    return res.status(201).json({
      success: true,
      message: "Registered successfully. Check you email for OTP",
      email,
      verificationToken: verificationToken,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: true, message: "Internal Server Error" });
  }
}
/**
 * @method POST /login
 * @prop { email, password }
 * @param {*} req
 * @param {*} res
 */
export async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ error: true, message: "Email and password are required" });
    }
    const EMAILREGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!EMAILREGEX.test(email)) {
      return res.status(400).json({
        error: true,
        message: "Invalid email",
      });
    }

    const result = await pool.query(
      "SELECT id, full_name, email, password_hash, email_verified FROM users WHERE email=$1",
      [email],
    );

    const user = result.rows[0];
    if (!user) {
      return res
        .status(400)
        .json({ error: true, message: "Invalid email or password" });
    }
    const matched = await bcrypt.compare(password, user.password_hash);
    if (!matched) {
      return res
        .status(400)
        .json({ error: true, message: "Invalid email or password" });
    }

    if (!user.email_verified) {
      return res.status(403).json({
        error: true,
        message: "Please verify your email before logging in",
      });
    }
    const source = req.headers["user-agent"] || "";
    const ua = useragent.parse(source);
    const deviceName = `${ua.browser} on ${ua.os}${ua.isMobile ? " (Mobile)" : ""}`;
    const session = await pool.query(
      "INSERT INTO session (user_id, ip_address, user_agent, device_name, expires_at) VALUES ($1, $2, $3, $4, NOW() + INTERVAL '30 days') RETURNING session_id",
      [user.id, req.ip || req.socket.remoteAddress, source, deviceName],
    );
    const sessionId = session.rows[0].session_id;
    const refreshToken = genRefreshToken(user.id, sessionId);
    const accessToken = genAccessToken(user.id, sessionId);

    // hash refresh token to save in db
    const resfrehTokenHash = await bcrypt.hash(refreshToken, 10);
    await pool.query(
      `WITH new_token AS (
    INSERT INTO refresh_token (user_id,session_id,token_hash,expires_at) VALUES ($1, $2, $3,NOW() + INTERVAL '30 days'))
    UPDATE users SET last_login_at = NOW() WHERE id = $1`,
      [user.id, sessionId, resfrehTokenHash],
    );

    res.cookie("refreshToken", refreshToken, cookieOptions);
    res.cookie("accessToken", accessToken, {
      ...cookieOptions,
      maxAge: 15 * 60 * 1000,
    });
    return res.status(200).json({
      success: true,
      message: "Logged in successfully",
      user: { name: user.full_name, username: user.username },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: true, message: "Internal Server Error" });
  }
}
/**
 * @method GET /refresh
 * @param {*} req
 * @param {*} res
 */
export async function refreshAccessToken(req, res) {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({
      error: true,
      code: "NO_REFRESH_TOKEN",
      message: "Refresh token not found",
    });
  }

  const decoded = jwtVerify(refreshToken, "refresh");

  try {
    const result = await pool.query(
      `
      SELECT
        rt.token_id,
        rt.user_id,
        rt.session_id
      FROM refresh_token rt
      JOIN session s
        ON s.session_id = rt.session_id
      WHERE rt.user_id = $1
        AND rt.session_id = $2
        AND rt.revoked_at IS NULL
        AND (
          rt.expires_at IS NULL
          OR rt.expires_at > NOW()
        )
        AND s.is_active = TRUE
        AND (
          s.expires_at IS NULL
          OR s.expires_at > NOW()
        )
      `,
      [decoded.id, decoded.sessionId],
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        error: true,
        code: "INVALID_REFRESH_TOKEN",
        message: "Refresh token is invalid or session is revoked",
      });
    }

    const newAccessToken = genAccessToken(decoded.id, decoded.sessionId);

    res.cookie("accessToken", newAccessToken, {
      ...cookieOptions,
      maxAge: 15 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Access token refreshed",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }
}

/**
 * @method POST /verify-otp
 * @prop {token, otp }
 * @param {*} req
 * @param {*} res
 */
export async function verifyOtp(req, res) {
  const { verificationToken, otp } = req.body;
  try {
    if (!verificationToken || !otp) {
      return res
        .status(400)
        .json({ error: true, message: "verificationToken or OTP missing" });
    }

    const result = await pool.query(
      "SELECT * FROM otp_verification WHERE otp_id=$1  AND attempts < 4",
      [verificationToken],
    );
    if (result.rows.length === 0) {
      return res
        .status(400)
        .json({ error: true, message: "Invalid or expired OTP session" });
    }

    const otpSession = result.rows[0];
    const matched = await bcrypt.compare(otp, otpSession.otp_hash);

    if (!matched) {
      await pool.query(
        "UPDATE otp_verification SET attempts = attempts + 1 WHERE otp_id = $1",
        [otpSession.otp_id],
      );
      return res.status(400).json({ error: true, message: "Invalid OTP" });
    }

    await pool.query(
      `WITH verified_user AS (
        UPDATE otp_verification SET verified_at = NOW() WHERE otp_id = $1 RETURNING user_id
      )
      UPDATE users SET email_verified = TRUE WHERE id = (SELECT user_id FROM verified_user)`,
      [otpSession.otp_id],
    );

    return res
      .status(200)
      .json({ success: true, message: "OTP verified, you can now log in" });
  } catch (error) {
    return res
      .status(500)
      .json({ error: true, message: "Internal Server Error" });
  }
}

export async function resendOTp(req, res) {
  const { verificationToken } = req.body;
  try {
    if (!verificationToken) {
      return res.status(400).json({ error: true, message: "Token is missing" });
    }

    const result = await pool.query(
      "SELECT * FROM otp_verification WHERE otp_id=$1",
      [verificationToken],
    );

    if (result.rows.length === 0) {
      return res
        .status(400)
        .json({ error: true, message: "Invalid Token, retry from email" });
    }
    if (result.rows[0].resent > 3) {
      return res.status(429).json({
        error: true,
        message: "Rate Limit Exceded, Try After Few Hours",
      });
    }

    const otpSession = result.rows[0];
    const newOTP = genrateOTP();
    console.log(newOTP, "------------------");

    const otpHash = await bcrypt.hash(newOTP, 10);
    const ress = await pool.query(
      "INSERT INTO otp_verification (otp_hash,email, attempts, resent ,expires_at) VALUES ($1,$2,$3, $4 , NOW() + INTERVAL '5 minutes')",
      [otpHash, result.rows[0].email, 0, result.rows[0].resent + 1],
    );
    // await otpTemplate(otpSession.email, newOTP, verificationToken);

    return res.status(200).json({
      success: true,
      message: "We had sent a new OTP, check you email",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: true, message: "Internal Server Error" });
  }
}

/**
 * @method POST /forgot-password
 * @prop { email }
 * @param {*} req
 * @param {*} res
 */
export async function forgotPassword(req, res) {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: true, message: "Email required" });
    }
    if (!EMAILREGEX.test(email)) {
      return res.status(400).json({ error: true, message: "Invalid Email" });
    }

    const result = await pool.query("SELECT id FROM users WHERE email=$1", [
      email,
    ]);
    if (result.rows.length === 0) {
      return res
        .status(400)
        .json({ error: true, message: "User Not Found. Register Now!" });
    }

    const resetToken = jwt.sign(
      { id: result.rows[0].id, type: "reset" },
      config.JWT_SECRET,
      {
        expiresIn: "15m",
      },
    );

    // await passwordResetOtpTemplate(email, resetToken);
    return res.status(200).json({
      success: true,
      message: "Password reset link sent to your email",
      token: resetToken,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: true, message: "Internal Server Error" });
  }
}

/**
 * @method PUT /save-password
 * @prop { email,otp, password }
 * @param {*} req
 * @param {*} res
 */
export async function savePassword(req, res) {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({
        error: true,
        message: "Missing Token OR Password.",
      });
    }
    const decoded = jwtVerify(token, "reset");
    if (decoded.error) {
      res.status(401).json({
        error: true,
        code: decoded.code,
        message: decoded.message,
      });
    }

    const result = await pool.query("SELECT id FROM users WHERE id=$1", [
      decoded.id,
    ]);
    if (result.rows.length === 0) {
      return res
        .status(400)
        .json({ error: true, message: "User not found. Register Now!" });
    }

    if (!STRONGPASSOWRDREGX.test(password)) {
      return res
        .status(400)
        .json({ error: true, message: "Required Strong Passoword" });
    }

    // Hash new password and mark reset token as used
    const passHash = await bcrypt.hash(password, 10);

    await pool.query("UPDATE users SET password_hash=$1 WHERE id=$2", [
      passHash,
      decoded.id,
    ]);

    return res.status(200).json({
      success: true,
      message: "Password reset successfully. Login Now!",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: true, message: "Internal Server Error" });
  }
}

export async function getMe(req, res) {
  try {
    const { USERID } = req.user;

    const result = await pool.query(
      `
      SELECT id, full_name, username
      FROM users
      WHERE id = $1
      `,
      [USERID],
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        error: true,
        code: "USER_NOT_FOUND",
        message: "User not found",
      });
    }

    const user = result.rows[0];

    return res.status(200).json({
      success: true,
      user: {
        id: user.id,
        fullName: user.full_name,
        username: user.username,
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }
}

/**
 * @method GET /logout
 * @param {*} req
 * @param {*} res
 */
export async function logout(req, res) {
  try {
    const { USERID, sessionId } = req.user;

    if (sessionId) {
      const client = await pool.connect();

      try {
        await client.query("BEGIN");

        await client.query(
          `UPDATE refresh_token
           SET revoked_at = NOW()
           WHERE session_id = $1 AND user_id =$2
             AND revoked_at IS NULL`,
          [sessionId, USERID],
        );

        await client.query(
          `UPDATE session
           SET is_active = FALSE
           WHERE session_id = $1 AND user_id =$2`,
          [sessionId, USERID],
        );

        await client.query("COMMIT");
      } catch (error) {
        await client.query("ROLLBACK");
        throw error;
      } finally {
        client.release();
      }
    }

    res.clearCookie("accessToken", cookieOptions);
    res.clearCookie("refreshToken", cookieOptions);

    return res.status(200).json({
      success: true,
      message: "Logged out from this device successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }
}
/**
 * @method GET /logout-all
 * @param {*} req
 * @param {*} res
 */
export async function logoutAll(req, res) {
  try {
    const { USERID } = req.user;

    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      await client.query(
        `UPDATE refresh_token
         SET revoked_at = NOW()
         WHERE user_id = $1
           AND revoked_at IS NULL`,
        [USERID],
      );

      await client.query(
        `UPDATE session
         SET is_active = FALSE
         WHERE user_id = $1`,
        [USERID],
      );

      await client.query("COMMIT");
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }

    res.clearCookie("accessToken", cookieOptions);
    res.clearCookie("refreshToken", cookieOptions);

    return res.status(200).json({
      success: true,
      message: "You have been logged out from all devices successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }
}
