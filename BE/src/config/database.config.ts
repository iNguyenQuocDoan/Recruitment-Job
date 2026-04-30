import mongoose from "mongoose";

export const connectDb = async () => {
  if (!process.env.DB_CONNECTION_STRING) {
    throw new Error("DB_CONNECTION_STRING env is required");
  }
  await mongoose.connect(process.env.DB_CONNECTION_STRING);
  console.log("Database connected successfully");
};
