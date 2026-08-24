import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import requestLogger from "./middleware/requestLogger.js";
import authRoutes from "./routes/authRoutes.js"

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(requestLogger)

app.use("/api/v1", authRoutes);

export default app;