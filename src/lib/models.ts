import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    name: String,
    points: { type: Number, default: 0 },
    history: [
      {
        type: Schema.Types.ObjectId,
        ref: "HuntItem",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const huntItemSchema = new Schema(
  {
    name: String,
    description: String,
    identifier: String,
    points: { type: Number, default: 0 },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);
const HuntItem =
  mongoose.models.HuntItem || mongoose.model("HuntItem", huntItemSchema);

export { User, HuntItem };
