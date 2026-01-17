import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    companyName: String,
    email: String,
    password: String,
    logo: String,
    phone: String,
    city: String,
    address: String,
    companyModel: String,
    companyEmployees: String,
    workingTime: String,
    workOvertime: String,
    description: String,
  },
  { timestamps: true }
);

const AccountCompany = mongoose.model(
  "AccountCompany",
  schema,
  "account_company"
);

export default AccountCompany;
