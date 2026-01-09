import express from "express";
import cors from "cors";

import routes from "./src/routes/index.routes";

const app = express();
const Port = 3001;

app.use(
  cors({
    origin: "*",
  })
); // Enable CORS for all routes

app.use(express.json()); // Middleware to parse JSON bodies

app.use("/", routes);

app.listen(Port, () => {
  console.log(`Server is running on http://localhost:${Port}`);
});
