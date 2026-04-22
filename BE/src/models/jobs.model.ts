import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    companyId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    salaryMin: {
      type: Number,
    },
    salaryMax: {
      type: Number,
    },
    position: {
      type: String,
    },
    workingForm: {
      type: String,
    },
    technologies: {
      type: [String],
    },
    description: {
      type: String,
    },
    images: {
      type: [String],
    },
  },
  {
    timestamps: true,
  },
);

const Job = mongoose.model("Job", schema, "jobs");
export default Job;
