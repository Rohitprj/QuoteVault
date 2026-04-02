import mongoose, { Schema } from "mongoose";
import type { IQuote } from "../types/index.js";

const quoteSchema = new Schema<IQuote>(
  {
    text: {
      type: String,
      required: [true, "Quote text is required"],
    },
    author: {
      type: String,
      default: null,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: ["Motivation", "Love", "Success", "Wisdom", "Humor"],
    },
  },
  {
    timestamps: true,
  },
);

// Indexes for better performance (mirrors SQL schema)
quoteSchema.index({ category: 1 });
quoteSchema.index({ text: "text", author: "text" });

const Quote = mongoose.model<IQuote>("Quote", quoteSchema);
export default Quote;
