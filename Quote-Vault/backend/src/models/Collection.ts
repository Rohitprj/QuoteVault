import mongoose, { Schema } from "mongoose";
import type { ICollection } from "../types/index.js";

const collectionSchema = new Schema<ICollection>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: [true, "Collection title is required"],
      trim: true,
    },
    quotes: [
      {
        type: Schema.Types.ObjectId,
        ref: "Quote",
      },
    ],
  },
  {
    timestamps: true,
  },
);

collectionSchema.index({ user: 1 });

const Collection = mongoose.model<ICollection>("Collection", collectionSchema);
export default Collection;
