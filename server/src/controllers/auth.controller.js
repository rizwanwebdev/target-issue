import pool from "../db/connect.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import config from "../config/config.js";

function genrateOTP() {
  return Math.floor(100000 + Math.random() * 900000);
}

const cookieOptions = {
  httpOnly: true,
  secure: config.NODE_ENV === "production",
  sameSite: "Strict",
  maxAge: 30 * 24 * 60 * 60 * 1000,
};

function genAccessToken(id) {
  return jwt.sign({ id }, config.JWT_SECRET, {
    expiresIn: "30d",
  });
}
function genRefreshToken(id) {
  return jwt.sign({ id }, config.JWT_SECRET, {
    expiresIn: "30d",
  });
}

/**
 * Register Controller
 */
export async function register(req, res) {
  const { name, email, password } = req.body;

  if (!name || email || password) {
    return res.status(400).json({
      error: true,
      message: "name, email and password are required",
    });
  }

  const user = await pool.query("SELECT email FROM users WHERE email=$1", [
    email,
  ]);

  if (user.rows.length > 0) {
    return res.status(400).json({
      error: true,
      message: "User with this email already exists",
    });
  }
  if (password.length < 6) {
    return res.status(401).json({
      error: true,
      message: "Password must be more than 6 chracters",
    });
  }
  const passHash = await bcrypt.hash(password, 10);

  const result = await pool.query(
    "INSERT INTO users (full_name,email, password_hash) VALUES ($1, $2, $3)",
    [name, email, passHash],
  );

  return res.status(201).json({
    success: true,
    message: "Registerd successfuly",
    email: email,
  });
}

/**
 * User Login Controller
 */

async function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      error: true,
      message: "email OR passowrd required",
    });
  }
  const user = await pool.query("SELECT email FROM users WHERE email=$1", [
    email,
  ]);
  const matched = await bcrypt.compare(password, user.rows[0].password_hash);
  if (!matched) {
    return res.status(400).json({
      error: true,
      message: "email or passowrd incorrect",
    });
  }
  if (!user.rows[0].email_verified) {
    return res.status(400).json({
      error: true,
      message: "email is not verified",
    });
  }

  const refreshToken = genRefreshToken(user.rows[0].id);
  const accessToken = genAccessToken(user.rows[0].id);

  res.cookie("refreshToken", refreshToken, cookieOptions);
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
    maxAge: 15 * 60 * 1000, // 15m
  });

  return res.status(200).json({
    success: true,
    message: "Logedin successfuly",
    user: {
      name: user.rows[0].full_name,
      email: user.rows[0].email,
    },
  });
}

/**
 * refresh access token with refreshToken
 * @param {*} req
 * @param {*} res
 */
async function refreshAccessToken(req, res) {
  const refreshToken = req.cookie.refreshToken;

  if (!refreshToken) {
    return res.status(400).json({
      error: true,
      message: "Refresh Token Not Found",
    });
  }

  const decoded = jwt.decode(refreshToken, config.JWT_SECRET);

  const user = await pool.query("SELECT id, email FROM users WHERE id=$1", [
    decoded.id,
  ]);
  if (user.rows.length === 0) {
    return res.status(401).json({
      message: "Not Authorized, User Not Found2",
    });
  }
  const accessToken = genAccessToken(user.rows[0].id);

  res.cookie(accessToken);
  res.cookie("accessToken", accessToken, {
    expires: new Date(Date.now() + 900000),
    httpOnly: true,
  });
  return res.status(200).json({
    success: true,
    message: "Token Refreshed",
  });
}

async function sendOTP(req, res) {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({
      error: true,
      message: "email not provided",
    });
  }
  const result = await pool.query(
    "SELECT id, email FROM users WHERE email=$1",
    [email],
  );
  if (result.rows.length === 0) {
    return res.status(400).json({
      error: true,
      message: "No user exists with this email",
    });
  }
  const otp = genrateOTP();
  //currently testing, latter is will send with email
  console.log(otp);
  const otpHash = await bcrypt.hash(otp);

  await pool.query(
    "INSERT INTO otp_verification (user_id, email, otp_hash, expires_at) VALUES ($1, $2, $3, NOW())",
    [result.rows[0].id, email, otpHash],
  );

  return res.status(200).json({
    success: true,
    message: "otp genrated",
  });
}

async function verifyOtp(req, res) {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({
      error: true,
      message: "email or otp missing",
    });
  }

  const result = await pool.query(
    "SELECT * FROM otp_verification WHERE email=$1",
    [email],
  );

  if (result.rows.length === 0) {
    return res.status(400).json({
      error: true,
      message: "There is no otp session, request otp again",
    });
  }
  const matched = await bcrypt.compare(otp, result.rows[0].otp_hash);
  if (!matched) {
    return res.status(400).json({
      error: true,
      message: "Invalid OTP",
    });
  }

  return res.status(200).json({
    success: true,
    message: "OTP verified now you can login",
  });
}
