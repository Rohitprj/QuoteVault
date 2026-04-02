import { Router, Response } from "express";
import Favorite from "../models/Favorite.js";
import { protect } from "../middleware/auth.js";
import type { AuthRequest, IQuote } from "../types/index.js";

const router = Router();

// All favorites routes require authentication
router.use(protect);

// ─── POST /api/favorites/toggle ─────────────────────────────────────────────
router.post(
  "/toggle",
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { quoteId } = req.body;
      const userId = req.user!._id;

      if (!quoteId) {
        res.status(400).json({ error: "quoteId is required" });
        return;
      }

      const existing = await Favorite.findOne({
        user: userId,
        quote: quoteId,
      });

      if (existing) {
        await Favorite.deleteOne({ _id: existing._id });
        res.json({ isFavorited: false, message: "Removed from favorites" });
      } else {
        await Favorite.create({ user: userId, quote: quoteId });
        res.json({ isFavorited: true, message: "Added to favorites" });
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      res.status(500).json({ error: "Error toggling favorite" });
    }
  },
);

// ─── GET /api/favorites ─────────────────────────────────────────────────────
router.get("/", async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!._id;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    const skip = (page - 1) * limit;

    const favorites = await Favorite.find({ user: userId })
      .populate<{ quote: IQuote }>("quote")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Favorite.countDocuments({ user: userId });
    const hasMore = skip + favorites.length < total;

    const quotes = favorites.filter((f) => f.quote).map((f) => f.quote);

    res.json({ data: quotes, hasMore, total });
  } catch (error) {
    console.error("Error fetching favorites:", error);
    res.status(500).json({ error: "Error fetching favorites" });
  }
});

// ─── GET /api/favorites/check/:quoteId ──────────────────────────────────────
router.get(
  "/check/:quoteId",
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user!._id;
      const { quoteId } = req.params;

      const favorite = await Favorite.findOne({
        user: userId,
        quote: quoteId,
      });

      res.json({ isFavorited: !!favorite });
    } catch (error) {
      console.error("Error checking favorite status:", error);
      res.status(500).json({ error: "Error checking favorite status" });
    }
  },
);

// ─── GET /api/favorites/ids ─────────────────────────────────────────────────
router.get("/ids", async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!._id;

    const favorites = await Favorite.find({ user: userId }).select("quote");
    const quoteIds = favorites.map((f) => f.quote);

    res.json({ data: quoteIds });
  } catch (error) {
    console.error("Error fetching favorite IDs:", error);
    res.status(500).json({ error: "Error fetching favorite IDs" });
  }
});

// ─── GET /api/favorites/count ───────────────────────────────────────────────
router.get("/count", async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!._id;
    const count = await Favorite.countDocuments({ user: userId });
    res.json({ count });
  } catch (error) {
    console.error("Error getting favorites count:", error);
    res.status(500).json({ error: "Error getting favorites count" });
  }
});

export default router;
