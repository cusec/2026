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

const adminAuditLogSchema = new Schema(
  {
    adminEmail: {
      type: String,
      required: true,
      index: true,
    },
    targetUserEmail: {
      type: String,
      required: false,
      index: true,
    },
    action: {
      type: String,
      required: true,
      index: true,
    },
    resourceType: {
      type: String,
      required: true,
      enum: ["user", "huntItem", "claimAttempts", "scheduleItem"],
      index: true,
    },
    resourceId: {
      type: String,
      required: false,
    },
    details: {
      type: Schema.Types.Mixed,
      required: false,
    },
    previousData: {
      type: Schema.Types.Mixed,
      required: false,
    },
    newData: {
      type: Schema.Types.Mixed,
      required: false,
    },
    ipAddress: {
      type: String,
      required: false,
    },
    userAgent: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

// Add indexes for better query performance
adminAuditLogSchema.index({ createdAt: -1 });
adminAuditLogSchema.index({ adminEmail: 1, createdAt: -1 });
adminAuditLogSchema.index({ targetUserEmail: 1, createdAt: -1 });
adminAuditLogSchema.index({ action: 1, createdAt: -1 });

// Day & ScheduleItem models

const ScheduleItemSchema = new Schema({
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  title: { type: String, required: true },
  location: { type: String },
  description: { type: String },
  detailedDescription: { type: String },
  track: { type: String, enum: ["A", "B", "C"], required: true },
  color: {
    type: String,
    enum: ["primary", "secondary", "accent", "sunset", "sea", "white"],
    default: "primary",
  },
});

const DaySchema = new Schema({
  day: { type: String, required: true },
  date: { type: String, required: true },
  timestamp: { type: Number, required: true }, // Format: YYYYMMDD (e.g., 20260101)
  schedule: { type: [ScheduleItemSchema], required: true },
});

const Day = mongoose.models.Day || mongoose.model("Day", DaySchema);

const User = mongoose.models.User || mongoose.model("User", userSchema);
const HuntItem =
  mongoose.models.HuntItem || mongoose.model("HuntItem", huntItemSchema);
const AdminAuditLog =
  mongoose.models.AdminAuditLog ||
  mongoose.model("AdminAuditLog", adminAuditLogSchema);

export { User, HuntItem, AdminAuditLog, Day };
