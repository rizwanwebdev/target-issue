import { Pool } from "pg";
import config from "../config/config.js";
import logger from "../utils/logger.js";

const pool = new Pool({
  connectionString: config.DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 2_000,
});

export async function checkDatabaseConnection() {
  try {
    const result = await pool.query("SELECT COUNT(*), NOW() FROM users");
    logger.success(
      `Database connected:${result.rows[0].count} users, ${new Date(result.rows[0].now).toLocaleString()}`,
    );

    return true;
  } catch (error) {
    logger.error("Database connection failed:", error.message);

    return false;
  }
}

export default pool;
