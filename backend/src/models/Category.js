import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 2,
      maxlength: 50
    },
    description: {
      type: String,
      maxlength: 200,
      default: ""
    }
  },
  { timestamps: true }
);

export default mongoose.model("Category", CategorySchema);
