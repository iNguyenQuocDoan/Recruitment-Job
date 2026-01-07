import express, { Request, Response } from "express";

const app = express();
const Port = 3001;

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World");
});
app.listen(Port, () => {
  console.log(`Server is running on http://localhost:${Port}`);
});
