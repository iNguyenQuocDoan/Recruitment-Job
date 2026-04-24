import mongoose from "mongoose";

export interface ICity {
  _id: mongoose.Types.ObjectId;
  name: string;
}

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

const City = mongoose.model<ICity>("City", schema, "cities");

export default City;
