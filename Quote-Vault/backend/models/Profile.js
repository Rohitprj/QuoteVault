const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // One profile per user
    },
    displayName: {
      type: String,
      default: null,
    },
    avatarUrl: {
      type: String,
      default: null,
    },
    settings: {
      theme: {
        type: String,
        enum: ["light", "dark"],
        default: "light",
      },
      accentColor: {
        type: String,
        default: "#007AFF",
      },
      fontSize: {
        type: String,
        enum: ["small", "medium", "large"],
        default: "medium",
      },
      notificationsEnabled: {
        type: Boolean,
        default: true,
      },
      notificationHour: {
        type: Number,
        default: 9,
        min: 0,
        max: 23,
      },
      notificationMinute: {
        type: Number,
        default: 0,
        min: 0,
        max: 59,
      },
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Profile", profileSchema);
