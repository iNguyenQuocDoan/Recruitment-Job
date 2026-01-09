import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    fullName: String,
    email: String,
    password: String,
  },
  { timestamps: true }
);

const AccountUser = mongoose.model("AccountUser", schema, "account_user");

export default AccountUser;
