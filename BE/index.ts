import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import routes from "./src/routes/index.routes";
import { connectDb } from "./src/config/database.config";

// load environment variables TRƯỚC KHI sử dụng
dotenv.config();

const app = express();
const Port = 3001;

// kết nối db
connectDb();

app.use(
  cors({
    origin: "http://localhost:3000", // chỉ định tên miền cụ thể,
    credentials: true, // cho phép gửi cookie
  })
); // Enable CORS for all routes

app.use(express.json()); // Middleware to parse JSON bodies

app.use("/", routes);

app.listen(Port, () => {
  console.log(`Server is running on http://localhost:${Port}`);
});
