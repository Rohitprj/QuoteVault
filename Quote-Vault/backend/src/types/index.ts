import { Request } from "express";
import { Document, Types } from "mongoose";

// ─── User ────────────────────────────────────────────────────────────────────
export interface IUser extends Document {
  _id: Types.ObjectId;
  email: string;
  password: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// ─── Quote ───────────────────────────────────────────────────────────────────
export type QuoteCategory =
  | "Motivation"
  | "Love"
  | "Success"
  | "Wisdom"
  | "Humor";

export interface IQuote extends Document {
  _id: Types.ObjectId;
  text: string;
  author: string | null;
  category: QuoteCategory;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Favorite ────────────────────────────────────────────────────────────────
export interface IFavorite extends Document {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  quote: Types.ObjectId | IQuote;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Collection ──────────────────────────────────────────────────────────────
export interface ICollection extends Document {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  title: string;
  quotes: Types.ObjectId[] | IQuote[];
  createdAt: Date;
  updatedAt: Date;
}

// ─── Profile / Settings ─────────────────────────────────────────────────────
export interface IUserSettings {
  theme: "light" | "dark";
  accentColor: string;
  fontSize: "small" | "medium" | "large";
  notificationsEnabled: boolean;
  notificationHour: number;
  notificationMinute: number;
}

export interface IProfile extends Document {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  displayName: string | null;
  avatarUrl: string | null;
  settings: IUserSettings;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Express augmentation ───────────────────────────────────────────────────
export interface AuthRequest extends Request {
  user?: IUser;
}
