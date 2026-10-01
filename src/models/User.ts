import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IUserDocument extends Document {
  email: string;
  fullName: string;
  username?: string;
  password?: string;
  googleId?: string;
  profilePic?: string;
  contacts: Types.ObjectId[];
  resetPasswordToken?: string;
  resetPasswordExpiresAt?: Date;
  hasChosenUsername?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUserDocument>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    username: {
      type: String,
      unique: true,
      sparse: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      minlength: 6,
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },
    profilePic: {
      type: String,
      default: "",
    },
    hasChosenUsername: {
      type: Boolean,
      default: false,
    },
    contacts: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    resetPasswordToken: {
      type: String,
    },
    resetPasswordExpiresAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

const User: Model<IUserDocument> =
  mongoose.models.User || mongoose.model<IUserDocument>("User", userSchema);

export default User;
