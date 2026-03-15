import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
{
  fullName: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 80
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },

  passwordHash: {
    type: String,
    required: true
  },

  role: {
    type: String,
    enum: ["resident", "provider"],
    required: true
  }

},
{ timestamps: true }
);

UserSchema.index({ email: 1 }, { unique: true });

export default mongoose.model("User", UserSchema);