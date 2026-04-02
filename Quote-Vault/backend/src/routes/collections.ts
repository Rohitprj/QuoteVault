import { Router, Response } from "express";
import Collection from "../models/Collection.js";
import { protect } from "../middleware/auth.js";
import type { AuthRequest } from "../types/index.js";

const router = Router();

// All collection routes require authentication
router.use(protect);

// ─── POST /api/collections ──────────────────────────────────────────────────
router.post("/", async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title } = req.body;
    const userId = req.user!._id;

    if (!title) {
      res.status(400).json({ error: "Collection title is required" });
      return;
    }

    const collection = await Collection.create({
      user: userId,
      title,
      quotes: [],
    });

    res.status(201).json({ data: collection });
  } catch (error) {
    console.error("Error creating collection:", error);
    res.status(500).json({ error: "Error creating collection" });
  }
});

// ─── GET /api/collections ───────────────────────────────────────────────────
router.get("/", async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!._id;

    const collections = await Collection.find({ user: userId })
      .sort({ createdAt: -1 })
      .select("-quotes");

    const collectionsWithCount = await Promise.all(
      collections.map(async (col) => {
        const fullCol = await Collection.findById(col._id);
        return {
          ...col.toObject(),
          quoteCount: fullCol?.quotes.length ?? 0,
        };
      }),
    );

    res.json({ data: collectionsWithCount });
  } catch (error) {
    console.error("Error fetching collections:", error);
    res.status(500).json({ error: "Error fetching collections" });
  }
});

// ─── GET /api/collections/:id ───────────────────────────────────────────────
router.get("/:id", async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!._id;

    const collection = await Collection.findOne({
      _id: req.params.id,
      user: userId,
    }).populate("quotes");

    if (!collection) {
      res.status(404).json({ error: "Collection not found or access denied" });
      return;
    }

    res.json({
      data: {
        ...collection.toObject(),
        quoteCount: collection.quotes.length,
      },
    });
  } catch (error) {
    console.error("Error fetching collection:", error);
    res.status(500).json({ error: "Error fetching collection" });
  }
});

// ─── POST /api/collections/:id/quotes ───────────────────────────────────────
router.post(
  "/:id/quotes",
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user!._id;
      const { quoteId } = req.body;

      if (!quoteId) {
        res.status(400).json({ error: "quoteId is required" });
        return;
      }

      const collection = await Collection.findOne({
        _id: req.params.id,
        user: userId,
      });

      if (!collection) {
        res
          .status(404)
          .json({ error: "Collection not found or access denied" });
        return;
      }

      const quoteExists = collection.quotes.some(
        (q) => q.toString() === quoteId,
      );
      if (quoteExists) {
        res
          .status(400)
          .json({ error: "Quote already exists in this collection" });
        return;
      }

      collection.quotes.push(quoteId);
      await collection.save();

      res.json({ success: true, message: "Quote added to collection" });
    } catch (error) {
      console.error("Error adding quote to collection:", error);
      res.status(500).json({ error: "Error adding quote to collection" });
    }
  },
);

// ─── DELETE /api/collections/:id/quotes/:quoteId ────────────────────────────
router.delete(
  "/:id/quotes/:quoteId",
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user!._id;

      const collection = await Collection.findOne({
        _id: req.params.id,
        user: userId,
      });

      if (!collection) {
        res
          .status(404)
          .json({ error: "Collection not found or access denied" });
        return;
      }

      collection.quotes = collection.quotes.filter(
        (q) => q.toString() !== req.params.quoteId,
      ) as typeof collection.quotes;
      await collection.save();

      res.json({ success: true, message: "Quote removed from collection" });
    } catch (error) {
      console.error("Error removing quote from collection:", error);
      res.status(500).json({ error: "Error removing quote from collection" });
    }
  },
);

// ─── PUT /api/collections/:id ───────────────────────────────────────────────
router.put("/:id", async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!._id;
    const { title } = req.body;

    if (!title) {
      res.status(400).json({ error: "Title is required" });
      return;
    }

    const collection = await Collection.findOneAndUpdate(
      { _id: req.params.id, user: userId },
      { title },
      { new: true },
    );

    if (!collection) {
      res.status(404).json({ error: "Collection not found or access denied" });
      return;
    }

    res.json({ success: true, data: collection });
  } catch (error) {
    console.error("Error updating collection:", error);
    res.status(500).json({ error: "Error updating collection" });
  }
});

// ─── DELETE /api/collections/:id ────────────────────────────────────────────
router.delete(
  "/:id",
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user!._id;

      const collection = await Collection.findOneAndDelete({
        _id: req.params.id,
        user: userId,
      });

      if (!collection) {
        res
          .status(404)
          .json({ error: "Collection not found or access denied" });
        return;
      }

      res.json({ success: true, message: "Collection deleted" });
    } catch (error) {
      console.error("Error deleting collection:", error);
      res.status(500).json({ error: "Error deleting collection" });
    }
  },
);

// ─── GET /api/collections/:id/check/:quoteId ───────────────────────────────
router.get(
  "/:id/check/:quoteId",
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user!._id;

      const collection = await Collection.findOne({
        _id: req.params.id,
        user: userId,
      });

      if (!collection) {
        res
          .status(404)
          .json({ error: "Collection not found or access denied" });
        return;
      }

      const isInCollection = collection.quotes
        .map((q) => q.toString())
        .includes(req.params.quoteId);

      res.json({ isInCollection });
    } catch (error) {
      console.error("Error checking quote in collection:", error);
      res.status(500).json({ error: "Error checking quote in collection" });
    }
  },
);

export default router;
