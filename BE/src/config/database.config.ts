const mongoose = require("mongoose");

export const connectDb = async () => {
  try {
    await mongoose.connect(process.env.DB_CONNECTION_STRING);
    console.log("Database connected successfully");
  } catch (err) {
    console.error("Failed to connect to database", err);
  }
};
