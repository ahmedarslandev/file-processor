import mongoose, { Schema } from "mongoose";

const fileSchema = new Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  filename: {
    type: String,
    default: "",
    unique: true,
  },
  filePath: {
    type: String,
    default: "",
    unique: true,
  },
  size: {
    type: Number,
    default: 0,
  },
  type: {
    type: String,
    default: "",
  },
  lastModefied: {
    type: Number,
    default: Date.now(),
  },
  noOfCallerIds: {
    type: Number,
    default: 0,
  },
  extentionName: {
    type: String,
    enum: ["xlsx", "xlsm", "csv"],
  },
  status: {
    type: String,
    default: "pending",
    enum: ["pending", "processing", "completed", "failed"],
  },
  realname: {
    type: String,
    default: "",
  },
});

const fileModel =
  mongoose.models.File || mongoose.model("File", fileSchema);

export { fileModel };
