import dotenv from "dotenv";
import app from "./src/app.js";
import config from "./src/config/config.js";
import logger from "./src/utils/logger.js";

import { checkDatabaseConnection } from "./src/db/connect.js";
dotenv.config();

const PORT = config.PORT || 3001;

async function startServer() {
  const isConnected = await checkDatabaseConnection();
  if (!isConnected) {
    process.exit(1);
  }
  app.listen(PORT, () => {
    logger.success(`Server is running: http://localhost:${PORT}`);
  });
}
startServer();
