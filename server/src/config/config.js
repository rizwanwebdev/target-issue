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
  PORT:getEnv("PORT"),
  POSTGRES_USER: getEnv("POSTGRES_USER"),
  POSTGRES_PASSWORD: getEnv("POSTGRES_USER"),
  POSTGRES_DB: getEnv("POSTGRES_USER"),
  DATABASE_URL: getEnv("POSTGRES_USER"),
};

export default config