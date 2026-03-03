const mongoose = require("mongoose");

const collectionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: [true, "Collection title is required"],
      trim: true,
    },
    // Embedded quote references (mirrors collection_quotes join table)
    quotes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Quote",
      },
    ],
  },
  {
    timestamps: true,
  },
);

// Index for efficient user-based lookups
collectionSchema.index({ user: 1 });

module.exports = mongoose.model("Collection", collectionSchema);
