import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    name: String,
    points: { type: Number, default: 0 },
    history: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "HuntItem",
        },
      ],
      default: [],
    },
    claim_attempts: {
      type: [
        {
          identifier: String,
          success: Boolean,
          timestamp: { type: Date, default: Date.now },
          item_id: {
            type: Schema.Types.ObjectId,
            ref: "HuntItem",
            required: false,
          },
        },
      ],
      default: [],
    },
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
