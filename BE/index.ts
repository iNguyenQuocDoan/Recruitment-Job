import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import routes from "./src/routes/index.routes";
import { connectDb } from "./src/config/database.config";
import { RESPONSE_CODE, RESPONSE_MESSAGE } from "./src/constants/http.constant";

dotenv.config();

const PORT = parseInt(process.env.PORT || "3001", 10);
const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:3000";

if (!process.env.JWT_SECRET) {
  console.error("JWT_SECRET env is required");
  process.exit(1);
}

const app = express();

app.use(helmet());

app.use(
  cors({
    origin: CORS_ORIGIN,
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

// Throttle brute-force on auth endpoints: 10 attempts / 15 min per IP.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { code: RESPONSE_CODE.ERROR, message: RESPONSE_MESSAGE.TOO_MANY_REQUESTS },
});
app.use("/user/login", authLimiter);
app.use("/user/register", authLimiter);
app.use("/company/login", authLimiter);
app.use("/company/register", authLimiter);

app.use("/", routes);

app.get("/", (_req, res) => {
  res.send("Hello World!");
});

connectDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to database, exiting:", err);
    process.exit(1);
  });
