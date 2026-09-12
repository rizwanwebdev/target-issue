import dotenv from "dotenv";
dotenv.config();

import app from "./src/app.js";
import config from "./src/config/config.js";
import logger from "./src/utils/logger.js";
import { checkDatabaseConnection } from "./src/db/connect.js";

const PORT = config.PORT || 3001;

async function startServer() {
  try {
    logger.info("Starting TargetIssue server...");

    const isConnected = await checkDatabaseConnection();

    if (!isConnected) {
      logger.error("Server startup aborted: database unavailable");
      process.exit(1);
    }

    app.listen(PORT, () => {
      logger.success(`Server is running: http://localhost:${PORT}`);
    });
  } catch (error) {
    logger.error(`Server startup failed: ${error.message}`);
    process.exit(1);
  }
}

startServer();
