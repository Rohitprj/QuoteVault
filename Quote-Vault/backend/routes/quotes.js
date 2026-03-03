const express = require("express");
const Quote = require("../models/Quote");

const router = express.Router();

// ─── GET /api/quotes ────────────────────────────────────────────────────────
// Mirrors: fetchQuotes(from, limit, category)
// Public route - no auth needed (mirrors RLS: "Quotes are viewable by everyone")
router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const category = req.query.category;
    const skip = (page - 1) * limit;

    const filter = {};
    if (category && category !== "All") {
      filter.category = category;
    }

    const quotes = await Quote.find(filter)
      .sort({ _id: 1 })
      .skip(skip)
      .limit(limit);

    const total = await Quote.countDocuments(filter);
    const hasMore = skip + quotes.length < total;

    res.json({
      data: quotes,
      hasMore,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Error fetching quotes:", error);
    res.status(500).json({ error: "Error fetching quotes" });
  }
});

// ─── GET /api/quotes/search ─────────────────────────────────────────────────
// Mirrors: searchQuotes(query)
router.get("/search", async (req, res) => {
  try {
    const query = req.query.q;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    if (!query) {
      return res.status(400).json({ error: "Search query is required" });
    }

    // Case-insensitive regex search (mirrors ilike in Supabase)
    const searchRegex = new RegExp(query, "i");
    const filter = {
      $or: [{ text: searchRegex }, { author: searchRegex }],
    };

    const quotes = await Quote.find(filter)
      .sort({ _id: 1 })
      .skip(skip)
      .limit(limit);

    const total = await Quote.countDocuments(filter);
    const hasMore = skip + quotes.length < total;

    res.json({ data: quotes, hasMore, total });
  } catch (error) {
    console.error("Error searching quotes:", error);
    res.status(500).json({ error: "Error searching quotes" });
  }
});

// ─── GET /api/quotes/today ──────────────────────────────────────────────────
// Mirrors: getQuoteOfTheDay()
router.get("/today", async (req, res) => {
  try {
    const count = await Quote.countDocuments();
    if (count === 0) {
      return res.status(404).json({ error: "No quotes available" });
    }

    // Deterministic selection based on date (same logic as Supabase version)
    const dayIndex = Math.floor(Date.now() / (1000 * 60 * 60 * 24));
    const quoteIndex = dayIndex % count;

    const quote = await Quote.findOne().sort({ _id: 1 }).skip(quoteIndex);

    res.json({ data: quote });
  } catch (error) {
    console.error("Error fetching quote of the day:", error);
    res.status(500).json({ error: "Error fetching quote of the day" });
  }
});

// ─── GET /api/quotes/categories ─────────────────────────────────────────────
// Mirrors: getCategories()
router.get("/categories", async (req, res) => {
  try {
    const categories = await Quote.distinct("category");
    categories.sort();
    res.json({ data: categories });
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ error: "Error fetching categories" });
  }
});

// ─── GET /api/quotes/:id ────────────────────────────────────────────────────
// Mirrors: getQuoteById(id)
router.get("/:id", async (req, res) => {
  try {
    const quote = await Quote.findById(req.params.id);
    if (!quote) {
      return res.status(404).json({ error: "Quote not found" });
    }
    res.json({ data: quote });
  } catch (error) {
    console.error("Error fetching quote:", error);
    res.status(500).json({ error: "Error fetching quote" });
  }
});

module.exports = router;
