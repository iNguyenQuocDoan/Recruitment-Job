import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import routes from "./src/routes/index.routes";
import { connectDb } from "./src/config/database.config";

// Load env BEFORE reading any process.env values below.
dotenv.config();

const PORT = parseInt(process.env.PORT || "3001", 10);
const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:3000";

// Boot-time config validation: fail fast instead of running with broken env.
if (!process.env.JWT_SECRET) {
  console.error("JWT_SECRET env is required");
  process.exit(1);
}

const app = express();

// Security headers (CSP defaults relaxed; we only serve JSON + Cloudinary
// already on its own origin, so the conservative defaults are fine).
app.use(helmet());

app.use(
  cors({
    origin: CORS_ORIGIN,
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

// Throttle credential-stuffing on auth endpoints. 10 attempts per 15 min
// per IP is loose enough for legit typos but stops scripted brute force.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { code: "error", message: "Too many requests, try again later" },
});
app.use("/user/login", authLimiter);
app.use("/user/register", authLimiter);
app.use("/company/login", authLimiter);
app.use("/company/register", authLimiter);

app.use("/", routes);

app.get("/", (_req, res) => {
  res.send("Hello World!");
});

// Connect DB first, only listen if it succeeds. Avoids the "server is up
// but every request 500s because Mongo never came back" footgun.
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
