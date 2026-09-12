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
const STRONGPASSOWRDREGX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
export async function register(req, res) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        error: true,
        message: "name, email and password are required",
      });
    }
    if (name.length < 4) {
      return res.status(400).json({
        error: true,
        message: "Name is less than 4 chracters",
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
      "INSERT INTO users (full_name, email, password_hash) VALUES ($1, $2, $3) RETURNING id",
      [name, email, passHash],
    );

    const otp = genrateOTP();
    const otpHash = await bcrypt.hash(otp, 10);
    const verificationToken = crypto.randomUUID();
    console.log(otp, verificationToken);

    await pool.query(
      "INSERT INTO otp_verification (otp_id, user_id, email, otp_hash, expires_at) VALUES ($1, $2, $3, $4, NOW() + INTERVAL '5 minutes')",
      [verificationToken, result.rows[0].id, email, otpHash],
    );

    // await otpTemplate(email, otp, verificationToken);
    console.log(email, otp, verificationToken);

    return res.status(201).json({
      success: true,
      message: "Registered successfully. Check you email for OTP",
      email,
      verificationToken: verificationToken,
    });
  } catch (error) {
    return res.status(500).json({ error: true, message: error.message });
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
      "INSERT INTO refresh_token (user_id, session_id, token_hash, expires_at) VALUES ($1, $2 ,$3, NOW() + INTERVAL '30 days')",
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
      user: { name: user.full_name, email: user.email },
    });
  } catch (error) {
    return res.status(500).json({ error: true, message: error.message });
  }
}
/**
 * @method GET /refresh
 * @param {*} req
 * @param {*} res
 */
export async function refreshAccessToken(req, res) {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res
        .status(401)
        .json({ error: true, message: "Refresh Token Not Found" });
    }

    const decoded = jwtVerify(refreshToken, "refresh");

    const newAccessToken = genAccessToken(decoded.id, decoded.sessionId);

    res.cookie("accessToken", newAccessToken, {
      ...cookieOptions,
      maxAge: 15 * 60 * 1000,
    });

    return res.status(200).json({ success: true, message: "Token Refreshed" });
  } catch (error) {
    return res
      .status(401)
      .json({ error: true, message: "Invalid or Expired Refresh Token" });
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
    console.log(verificationToken, otp);

    if (!verificationToken || !otp) {
      return res
        .status(400)
        .json({ error: true, message: "verificationToken or OTP missing" });
    }

    const result = await pool.query(
      "SELECT * FROM otp_verification WHERE otp_id=$1  AND attempts < 4",
      [verificationToken],
    );
    console.log(result.rows);
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
    return res.status(500).json({ error: true, message: error.message });
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

    const otpHash = await bcrypt.hash(newOTP, 10);
    const ress = await pool.query(
      "INSERT INTO otp_verification (otp_hash,email, attempts, resent ,expires_at) VALUES ($1,$2,$3, $4 , NOW() + INTERVAL '5 minutes')",
      [otpHash, result.rows[0].email, 0, result.rows[0].resent + 1],
    );
    // await otpTemplate(email, otp, verificationToken);
    console.log(verificationToken, newOTP);

    return res.status(200).json({
      success: true,
      message: "We had sent a new OTP, check you email",
    });
  } catch (error) {
    return res.status(500).json({ error: true, message: error.message });
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
    if (EMAILREGEX.test(email)) {
      return res.status(400).json({ error: true, message: "Invalid Email" });
    }

    const result = await pool.query("SELECT id FROM users WHERE email=$1", [
      email,
    ]);
    if (result.rows.length === 0) {
      return res.status(400).json({ error: true, message: "User Not Found" });
    }

    const resetOTP = genrateOTP();
    const otpHash = await bcrypt.hash(resetOTP, 10);

    await pool.query(
      "INSERT INTO password_reset (user_id, token_hash, expires_at) VALUES ($1, $2, NOW() + INTERVAL '5 minutes')",
      [result.rows[0].id, otpHash],
    );
    console.log(resetOTP, email);
    // await passwordResetOtpTemplate(email, resetOTP);
    return res.status(200).json({
      success: true,
      message: "Password reset OTP sent to your email",
    });
  } catch (error) {
    return res.status(500).json({ error: true, message: error.message });
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
    const { email, otp, password } = req.body;

    if (!email || !otp || !password) {
      return res.status(400).json({
        error: true,
        message: "Email, OTP, and password are required",
      });
    }
    if (EMAILREGEX.test(email)) {
      return res.status(400).json({ error: true, message: "Invalid Email" });
    }

    const result = await pool.query("SELECT id FROM users WHERE email=$1", [
      email,
    ]);
    if (result.rows.length === 0) {
      return res
        .status(400)
        .json({ error: true, message: "User not found. Register Now!" });
    }

    const userId = result.rows[0].id;

    // Fetch active reset OTP record
    const resetResult = await pool.query(
      "SELECT * FROM password_reset WHERE user_id=$1 AND expires_at > NOW() AND used = FALSE ORDER BY created_at DESC LIMIT 1",
      [userId],
    );

    if (resetResult.rows.length === 0) {
      return res
        .status(400)
        .json({ error: true, message: "Invalid or expired reset request" });
    }

    const resetRecord = resetResult.rows[0];
    const matched = await bcrypt.compare(String(otp), resetRecord.token_hash);

    if (!matched) {
      return res.status(400).json({ error: true, message: "Invalid OTP" });
    }

    // Hash new password and mark reset token as used
    const passHash = await bcrypt.hash(password, 10);

    await pool.query(
      `WITH updated_user AS (
        UPDATE users SET password_hash=$1 WHERE id=$2)
        UPDATE password_reset SET used = TRUE WHERE id=$3
      `,
      [passHash, userId, resetRecord.reset_id],
    );

    return res.status(200).json({
      success: true,
      message: "Password reset successfully. Login Now!",
    });
  } catch (error) {
    return res.status(500).json({ error: true, message: error.message });
  }
}

/**
 * @method GET /logout
 * @param {*} req
 * @param {*} res
 */
export async function logout(req, res) {
  try {
    const sessionId = req.user.sessionId;

    if (sessionId) {
      await pool.query(
        "UPDATE refresh_token SET revoked_at=NOW() WHERE session_id=$1",
        [sessionId],
      );
      await pool.query("DELETE FROM session WHERE session_id = $1", [
        sessionId,
      ]);
    }

    res.clearCookie("accessToken", cookieOptions);
    res.clearCookie("refreshToken", cookieOptions);

    return res.status(200).json({
      success: true,
      message: "Logged out from this device successfully",
    });
  } catch (error) {
    return res.status(500).json({ error: true, message: error.message });
  }
}
/**
 * @method GET /logout-all
 * @param {*} req
 * @param {*} res
 */
export async function logoutAll(req, res) {
  try {
    const userId = req.user.id;

    if (userId) {
      await pool.query(
        "UPDATE refresh_token SET revoked_at=NOW() WHERE user_id=$1",
        [userId],
      );
      await pool.query("DELETE FROM session WHERE user_id = $1", [userId]);
    }

    res.clearCookie("accessToken", cookieOptions);
    res.clearCookie("refreshToken", cookieOptions);

    return res.status(200).json({
      success: true,
      message: "You have been logged out from all devices successfully",
    });
  } catch (error) {
    return res.status(500).json({ error: true, message: error.message });
  }
}
