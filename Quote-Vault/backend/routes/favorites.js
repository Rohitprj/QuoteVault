const express = require("express");
const Favorite = require("../models/Favorite");
const { protect } = require("../middleware/auth");

const router = express.Router();

// All favorites routes require authentication
router.use(protect);

// ─── POST /api/favorites/toggle ─────────────────────────────────────────────
// Mirrors: toggleFavorite(userId, quoteId, isCurrentlyFavorited)
router.post("/toggle", async (req, res) => {
  try {
    const { quoteId } = req.body;
    const userId = req.user._id;

    if (!quoteId) {
      return res.status(400).json({ error: "quoteId is required" });
    }

    // Check if already favorited
    const existing = await Favorite.findOne({ user: userId, quote: quoteId });

    if (existing) {
      // Remove favorite
      await Favorite.deleteOne({ _id: existing._id });
      return res.json({
        isFavorited: false,
        message: "Removed from favorites",
      });
    } else {
      // Add favorite
      await Favorite.create({ user: userId, quote: quoteId });
      return res.json({ isFavorited: true, message: "Added to favorites" });
    }
  } catch (error) {
    console.error("Error toggling favorite:", error);
    res.status(500).json({ error: "Error toggling favorite" });
  }
});

// ─── GET /api/favorites ─────────────────────────────────────────────────────
// Mirrors: getUserFavorites(userId, from, limit)
router.get("/", async (req, res) => {
  try {
    const userId = req.user._id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    const favorites = await Favorite.find({ user: userId })
      .populate("quote") // Join with quotes collection
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Favorite.countDocuments({ user: userId });
    const hasMore = skip + favorites.length < total;

    // Return the quote data directly (matches frontend expectation)
    const quotes = favorites
      .filter((f) => f.quote) // Filter out any deleted quotes
      .map((f) => f.quote);

    res.json({ data: quotes, hasMore, total });
  } catch (error) {
    console.error("Error fetching favorites:", error);
    res.status(500).json({ error: "Error fetching favorites" });
  }
});

// ─── GET /api/favorites/check/:quoteId ──────────────────────────────────────
// Mirrors: checkFavoriteStatus(userId, quoteId)
router.get("/check/:quoteId", async (req, res) => {
  try {
    const userId = req.user._id;
    const { quoteId } = req.params;

    const favorite = await Favorite.findOne({ user: userId, quote: quoteId });

    res.json({ isFavorited: !!favorite });
  } catch (error) {
    console.error("Error checking favorite status:", error);
    res.status(500).json({ error: "Error checking favorite status" });
  }
});

// ─── GET /api/favorites/ids ─────────────────────────────────────────────────
// Mirrors: getFavoriteQuoteIds(userId)
router.get("/ids", async (req, res) => {
  try {
    const userId = req.user._id;

    const favorites = await Favorite.find({ user: userId }).select("quote");
    const quoteIds = favorites.map((f) => f.quote);

    res.json({ data: quoteIds });
  } catch (error) {
    console.error("Error fetching favorite IDs:", error);
    res.status(500).json({ error: "Error fetching favorite IDs" });
  }
});

// ─── GET /api/favorites/count ───────────────────────────────────────────────
// Mirrors: getFavoritesCount(userId)
router.get("/count", async (req, res) => {
  try {
    const userId = req.user._id;
    const count = await Favorite.countDocuments({ user: userId });
    res.json({ count });
  } catch (error) {
    console.error("Error getting favorites count:", error);
    res.status(500).json({ error: "Error getting favorites count" });
  }
});

module.exports = router;
