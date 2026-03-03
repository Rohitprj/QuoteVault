const mongoose = require("mongoose");

const quoteSchema = new mongoose.Schema(
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
quoteSchema.index({ text: "text", author: "text" }); // Text index for search

module.exports = mongoose.model("Quote", quoteSchema);
