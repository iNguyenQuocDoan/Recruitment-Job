import mongoose from "mongoose";

export interface IAccountUser {
  _id: mongoose.Types.ObjectId;
  fullName: string;
  email: string;
  password: string;
  avatar?: string;
  phone?: string;
}

const schema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
    },
    phone: {
      type: String,
    },
  },
  { timestamps: true },
);

const AccountUser = mongoose.model<IAccountUser>(
  "AccountUser",
  schema,
  "account_user",
);

export default AccountUser;
