import mongoose, { Schema } from "mongoose";
import type { IProfile } from "../types/index.js";

const profileSchema = new Schema<IProfile>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
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

const Profile = mongoose.model<IProfile>("Profile", profileSchema);
export default Profile;
