import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    name: { type: String, default: "Display Name" },
    linked_email: { type: String, default: null },
    discord_handle: { type: String, default: null },
    points: { type: Number, default: 0 },
    claimedItems: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "HuntItem",
        },
      ],
      default: [],
    },
    collectibles: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "Collectible",
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
    maxClaims: { type: Number, default: null },
    claimCount: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
    activationStart: { type: Date, default: null },
    activationEnd: { type: Date, default: null },
    collectibles: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "Collectible",
        },
      ],
      default: [],
    },
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
      enum: [
        "user",
        "huntItem",
        "claimAttempts",
        "scheduleItem",
        "shopItem",
        "collectible",
      ],
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

const shopItemSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    cost: { type: Number, required: true, default: 0 },
    limited: { type: Boolean, default: false },
    remaining: { type: Number, default: 0 },
    moderated: { type: Boolean, default: false },
    imageData: { type: String, required: true }, // Base64 encoded image data
    imageContentType: { type: String, required: true }, // MIME type (e.g., image/png, image/jpeg)
  },
  {
    timestamps: true,
  }
);

const noticeSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const collectibleSchema = new Schema(
  {
    name: { type: String, required: true },
    subtitle: { type: String, default: "" },
    description: { type: String, default: "" },
    slug: { type: String, required: true, unique: true },
    points: { type: Number, default: 0 },
    purchasable: { type: Boolean, default: false },
    imageData: { type: String, required: true },
    imageContentType: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const Day = mongoose.models.Day || mongoose.model("Day", DaySchema);

const User = mongoose.models.User || mongoose.model("User", userSchema);
const HuntItem =
  mongoose.models.HuntItem || mongoose.model("HuntItem", huntItemSchema);
const AdminAuditLog =
  mongoose.models.AdminAuditLog ||
  mongoose.model("AdminAuditLog", adminAuditLogSchema);
const ShopItem =
  mongoose.models.ShopItem || mongoose.model("ShopItem", shopItemSchema);
const Notice = mongoose.models.Notice || mongoose.model("Notice", noticeSchema);
const Collectible =
  mongoose.models.Collectible ||
  mongoose.model("Collectible", collectibleSchema);

export { User, HuntItem, AdminAuditLog, Day, ShopItem, Notice, Collectible };
