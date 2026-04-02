import mongoose, { Schema } from "mongoose";
import type { IFavorite } from "../types/index.js";

const favoriteSchema = new Schema<IFavorite>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    quote: {
      type: Schema.Types.ObjectId,
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
favoriteSchema.index({ user: 1 });

const Favorite = mongoose.model<IFavorite>("Favorite", favoriteSchema);
export default Favorite;
