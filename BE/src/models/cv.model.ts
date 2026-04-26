import mongoose from "mongoose";

export type CvStatus = "pending" | "approved" | "rejected";

export interface ICV {
  _id: mongoose.Types.ObjectId;
  jobId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  fullName: string;
  email: string;
  phone: string;
  fileUrl: string;
  status: CvStatus;
  viewed: boolean;
  note?: string;
  deletedAt?: Date | null;
}

const schema = new mongoose.Schema(
  {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AccountUser",
      required: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    fileUrl: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
      required: true,
    },
    viewed: {
      type: Boolean,
      default: false,
      required: true,
    },
    note: {
      type: String,
      default: "",
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

const Cv = mongoose.model<ICV>("Cv", schema, "cvs");

export default Cv;
