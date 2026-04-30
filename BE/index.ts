import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

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

app.use(
  cors({
    origin: CORS_ORIGIN,
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

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
