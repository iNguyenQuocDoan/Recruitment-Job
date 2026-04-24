import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    companyName: {
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
    logo: {
      type: String,
    },
    phone: {
      type: String,
    },
    city: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "City",
    },
    address: {
      type: String,
    },
    companyModel: {
      type: String,
    },
    companyEmployees: {
      type: String,
    },
    workingTime: {
      type: String,
    },
    workOvertime: {
      type: String,
    },
    description: {
      type: String,
    },
  },
  { timestamps: true },
);

const AccountCompany = mongoose.model(
  "AccountCompany",
  schema,
  "account_company",
);

export default AccountCompany;
