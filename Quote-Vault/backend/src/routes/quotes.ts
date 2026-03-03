import { Router, Request, Response } from "express";
import Quote from "../models/Quote.js";

const router = Router();

// ─── GET /api/quotes ────────────────────────────────────────────────────────
router.get("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const category = req.query.category as string | undefined;
    const skip = (page - 1) * limit;

    const filter: Record<string, string> = {};
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
router.get("/search", async (req: Request, res: Response): Promise<void> => {
  try {
    const query = req.query.q as string | undefined;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    const skip = (page - 1) * limit;

    if (!query) {
      res.status(400).json({ error: "Search query is required" });
      return;
    }

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
router.get("/today", async (_req: Request, res: Response): Promise<void> => {
  try {
    const count = await Quote.countDocuments();
    if (count === 0) {
      res.status(404).json({ error: "No quotes available" });
      return;
    }

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
router.get(
  "/categories",
  async (_req: Request, res: Response): Promise<void> => {
    try {
      const categories: string[] = await Quote.distinct("category");
      categories.sort();
      res.json({ data: categories });
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ error: "Error fetching categories" });
    }
  },
);

// ─── GET /api/quotes/:id ────────────────────────────────────────────────────
router.get("/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const quote = await Quote.findById(req.params.id);
    if (!quote) {
      res.status(404).json({ error: "Quote not found" });
      return;
    }
    res.json({ data: quote });
  } catch (error) {
    console.error("Error fetching quote:", error);
    res.status(500).json({ error: "Error fetching quote" });
  }
});

export default router;
