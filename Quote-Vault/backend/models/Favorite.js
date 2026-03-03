const mongoose = require("mongoose");

const favoriteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    quote: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quote",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

// Ensure a user can only favorite a quote once (mirrors UNIQUE(user_id, quote_id))
favoriteSchema.index({ user: 1, quote: 1 }, { unique: true });
// Index for efficient user-based queries
favoriteSchema.index({ user: 1 });

module.exports = mongoose.model("Favorite", favoriteSchema);
