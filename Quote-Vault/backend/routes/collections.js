const express = require("express");
const Collection = require("../models/Collection");
const { protect } = require("../middleware/auth");

const router = express.Router();

// All collection routes require authentication
router.use(protect);

// ─── POST /api/collections ──────────────────────────────────────────────────
// Mirrors: createCollection(userId, title)
router.post("/", async (req, res) => {
  try {
    const { title } = req.body;
    const userId = req.user._id;

    if (!title) {
      return res.status(400).json({ error: "Collection title is required" });
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
// Mirrors: getUserCollections(userId)
router.get("/", async (req, res) => {
  try {
    const userId = req.user._id;

    const collections = await Collection.find({ user: userId })
      .sort({ createdAt: -1 })
      .select("-quotes"); // Exclude full quotes array for listing

    // Add quoteCount to each collection
    const collectionsWithCount = await Promise.all(
      collections.map(async (col) => {
        const fullCol = await Collection.findById(col._id);
        return {
          ...col.toObject(),
          quoteCount: fullCol.quotes.length,
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
// Mirrors: getCollectionWithQuotes(collectionId, userId)
router.get("/:id", async (req, res) => {
  try {
    const userId = req.user._id;

    const collection = await Collection.findOne({
      _id: req.params.id,
      user: userId,
    }).populate("quotes"); // Populate full quote objects

    if (!collection) {
      return res
        .status(404)
        .json({ error: "Collection not found or access denied" });
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
// Mirrors: addQuoteToCollection(collectionId, quoteId, userId)
router.post("/:id/quotes", async (req, res) => {
  try {
    const userId = req.user._id;
    const { quoteId } = req.body;

    if (!quoteId) {
      return res.status(400).json({ error: "quoteId is required" });
    }

    const collection = await Collection.findOne({
      _id: req.params.id,
      user: userId,
    });

    if (!collection) {
      return res
        .status(404)
        .json({ error: "Collection not found or access denied" });
    }

    // Check if quote is already in collection (mirrors UNIQUE constraint)
    if (collection.quotes.includes(quoteId)) {
      return res
        .status(400)
        .json({ error: "Quote already exists in this collection" });
    }

    collection.quotes.push(quoteId);
    await collection.save();

    res.json({ success: true, message: "Quote added to collection" });
  } catch (error) {
    console.error("Error adding quote to collection:", error);
    res.status(500).json({ error: "Error adding quote to collection" });
  }
});

// ─── DELETE /api/collections/:id/quotes/:quoteId ────────────────────────────
// Mirrors: removeQuoteFromCollection(collectionId, quoteId, userId)
router.delete("/:id/quotes/:quoteId", async (req, res) => {
  try {
    const userId = req.user._id;

    const collection = await Collection.findOne({
      _id: req.params.id,
      user: userId,
    });

    if (!collection) {
      return res
        .status(404)
        .json({ error: "Collection not found or access denied" });
    }

    collection.quotes = collection.quotes.filter(
      (q) => q.toString() !== req.params.quoteId,
    );
    await collection.save();

    res.json({ success: true, message: "Quote removed from collection" });
  } catch (error) {
    console.error("Error removing quote from collection:", error);
    res.status(500).json({ error: "Error removing quote from collection" });
  }
});

// ─── PUT /api/collections/:id ───────────────────────────────────────────────
// Mirrors: updateCollectionTitle(collectionId, newTitle, userId)
router.put("/:id", async (req, res) => {
  try {
    const userId = req.user._id;
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({ error: "Title is required" });
    }

    const collection = await Collection.findOneAndUpdate(
      { _id: req.params.id, user: userId },
      { title },
      { new: true },
    );

    if (!collection) {
      return res
        .status(404)
        .json({ error: "Collection not found or access denied" });
    }

    res.json({ success: true, data: collection });
  } catch (error) {
    console.error("Error updating collection:", error);
    res.status(500).json({ error: "Error updating collection" });
  }
});

// ─── DELETE /api/collections/:id ────────────────────────────────────────────
// Mirrors: deleteCollection(collectionId, userId)
router.delete("/:id", async (req, res) => {
  try {
    const userId = req.user._id;

    const collection = await Collection.findOneAndDelete({
      _id: req.params.id,
      user: userId,
    });

    if (!collection) {
      return res
        .status(404)
        .json({ error: "Collection not found or access denied" });
    }

    res.json({ success: true, message: "Collection deleted" });
  } catch (error) {
    console.error("Error deleting collection:", error);
    res.status(500).json({ error: "Error deleting collection" });
  }
});

// ─── GET /api/collections/:id/check/:quoteId ───────────────────────────────
// Mirrors: isQuoteInCollection(collectionId, quoteId, userId)
router.get("/:id/check/:quoteId", async (req, res) => {
  try {
    const userId = req.user._id;

    const collection = await Collection.findOne({
      _id: req.params.id,
      user: userId,
    });

    if (!collection) {
      return res
        .status(404)
        .json({ error: "Collection not found or access denied" });
    }

    const isInCollection = collection.quotes
      .map((q) => q.toString())
      .includes(req.params.quoteId);

    res.json({ isInCollection });
  } catch (error) {
    console.error("Error checking quote in collection:", error);
    res.status(500).json({ error: "Error checking quote in collection" });
  }
});

module.exports = router;
