import dotenv from "dotenv";
import app from "./src/app.js";
import config from "./src/config/config.js";

dotenv.config();

const PORT = config.PORT || 3001;

app.listen(PORT, () => {
  console.log(`TargetIssue API running on port ${PORT}`);
});