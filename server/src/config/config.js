import dotenv from "dotenv";

dotenv.config();

function getEnv(key) {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing ENV variable: ${key}`);
  }
  return value;
}

const config = {
  NODE_ENV: getEnv("NODE_ENV"),
  JWT_SECRET: getEnv("JWT_SECRET"),
  PORT: getEnv("PORT"),
  POSTGRES_USER: getEnv("POSTGRES_USER"),
  POSTGRES_PASSWORD: getEnv("POSTGRES_PASSWORD"),
  POSTGRES_DB: getEnv("POSTGRES_DB"),
  DATABASE_URL: getEnv("DATABASE_URL"),
  CLIENT_URL: getEnv("CLIENT_URL"),
  GOOGLE_USER: getEnv("GOOGLE_USER"),
  GOOGLE_CLIENT_ID: getEnv("GOOGLE_CLIENT_ID"),
  GOOGLE_CLIENT_SECRET: getEnv("GOOGLE_CLIENT_SECRET"),
  GOOGLE_REFRESH_TOKEN: getEnv("GOOGLE_REFRESH_TOKEN"),
};

export default config;
