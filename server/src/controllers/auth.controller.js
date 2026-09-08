import pool from "../db/connect.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "../config/config.js";
import { otpTemplate, passwordResetOtpTemplate } from "../utils/email.util.js";

function genrateOTP() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

const cookieOptions = {
  httpOnly: true,
  secure: config.NODE_ENV === "production",
  sameSite: "Strict",
  maxAge: 30 * 24 * 60 * 60 * 1000,
};

function genAccessToken(id) {
  return jwt.sign({ id, type: "access" }, config.JWT_SECRET, {
    expiresIn: "15m",
  });
}

function genRefreshToken(id) {
  return jwt.sign({ id, type: "refresh" }, config.JWT_SECRET, {
    expiresIn: "30d",
  });
}

export async function register(req, res) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        error: true,
        message: "name, email and password are required",
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

    if (password.length < 6) {
      return res.status(400).json({
        error: true,
        message: "Password must be at least 6 characters",
      });
    }

    const passHash = await bcrypt.hash(password, 10);
    await pool.query(
      "INSERT INTO users (full_name, email, password_hash) VALUES ($1, $2, $3)",
      [name, email, passHash],
    );

    return res
      .status(201)
      .json({ success: true, message: "Registered successfully", email });
  } catch (error) {
    return res.status(500).json({ error: true, message: error.message });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ error: true, message: "Email and password are required" });
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

    const refreshToken = genRefreshToken(user.id);
    const accessToken = genAccessToken(user.id);

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

export async function refreshAccessToken(req, res) {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res
        .status(401)
        .json({ error: true, message: "Refresh Token Not Found" });
    }

    const decoded = jwt.verify(refreshToken, config.JWT_SECRET);
    if (decoded.type !== "refresh") {
      return res
        .status(401)
        .json({ error: true, message: "Invalid Token Type" });
    }

    const user = await pool.query("SELECT id FROM users WHERE id=$1", [
      decoded.id,
    ]);
    if (user.rows.length === 0) {
      return res.status(401).json({ error: true, message: "User not found" });
    }

    const newAccessToken = genAccessToken(user.rows[0].id);

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

export async function sendOTP(req, res) {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: true, message: "Email required" });
    }

    const result = await pool.query("SELECT id FROM users WHERE email=$1", [
      email,
    ]);
    if (result.rows.length === 0) {
      return res
        .status(400)
        .json({ error: true, message: "No user exists with this email" });
    }

    const otp = genrateOTP();
    const otpHash = await bcrypt.hash(otp, 10);

    await pool.query(
      "INSERT INTO otp_verification (user_id, email, otp_hash, expires_at) VALUES ($1, $2, $3, NOW() + INTERVAL '10 minutes')",
      [result.rows[0].id, email, otpHash],
    );

    await otpTemplate(email, otp);
    return res
      .status(200)
      .json({ success: true, message: "OTP sent to your email" });
  } catch (error) {
    return res.status(500).json({ error: true, message: error.message });
  }
}

export async function verifyOtp(req, res) {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res
        .status(400)
        .json({ error: true, message: "Email or OTP missing" });
    }

    const result = await pool.query(
      "SELECT * FROM otp_verification WHERE email=$1 AND expires_at > NOW() AND attempts < 4 ORDER BY created_at DESC LIMIT 1",
      [email],
    );

    if (result.rows.length === 0) {
      return res
        .status(400)
        .json({ error: true, message: "Invalid or expired OTP session" });
    }

    const otpSession = result.rows[0];
    const matched = await bcrypt.compare(String(otp), otpSession.otp_hash);

    if (!matched) {
      await pool.query(
        "UPDATE otp_verification SET attempts = attempts + 1 WHERE otp_id = $1",
        [otpSession.otp_id],
      );
      return res.status(400).json({ error: true, message: "Invalid OTP" });
    }

    await pool.query(
      `WITH verified_otp AS (
        UPDATE otp_verification SET verified_at = NOW() WHERE otp_id = $1 RETURNING user_id
      )
      UPDATE users SET email_verified = TRUE WHERE id = (SELECT user_id FROM verified_otp)`,
      [otpSession.otp_id],
    );

    return res
      .status(200)
      .json({ success: true, message: "OTP verified, you can now log in" });
  } catch (error) {
    return res.status(500).json({ error: true, message: error.message });
  }
}

export async function resetPassword(req, res) {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: true, message: "Email required" });
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

    await passwordResetOtpTemplate(email, resetOTP);
    return res.status(200).json({
      success: true,
      message: "Password reset OTP sent to your email",
    });
  } catch (error) {
    return res.status(500).json({ error: true, message: error.message });
  }
}

export async function savePassword(req, res) {
  try {
    const { email, otp, password } = req.body;

    if (!email || !otp || !password) {
      return res.status(400).json({
        error: true,
        message: "Email, OTP, and password are required",
      });
    }

    const userResult = await pool.query("SELECT id FROM users WHERE email=$1", [
      email,
    ]);
    if (userResult.rows.length === 0) {
      return res.status(400).json({ error: true, message: "User not found" });
    }

    const userId = userResult.rows[0].id;

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

    return res
      .status(200)
      .json({ success: true, message: "Password reset successfully" });
  } catch (error) {
    return res.status(500).json({ error: true, message: error.message });
  }
}
