import mongoose from "mongoose";

import { ICity } from "./city.model";

export interface IAccountCompany {
  _id: mongoose.Types.ObjectId;
  companyName: string;
  email: string;
  password: string;
  logo?: string;
  phone?: string;
  city?: mongoose.Types.ObjectId | ICity;
  address?: string;
  companyModel?: string;
  companyEmployees?: string;
  workingTime?: string;
  workOvertime?: string;
  description?: string;
}

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

const AccountCompany = mongoose.model<IAccountCompany>(
  "AccountCompany",
  schema,
  "account_company",
);

export default AccountCompany;
