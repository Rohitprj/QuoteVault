import "dotenv/config";
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import connectDB from "./config/db.js";

import authRoutes from "./routes/auth.js";
import quotesRoutes from "./routes/quotes.js";
import favoritesRoutes from "./routes/favorites.js";
import collectionsRoutes from "./routes/collections.js";
import profileRoutes from "./routes/profile.js";

// Connect to MongoDB
await connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/quotes", quotesRoutes);
app.use("/api/favorites", favoritesRoutes);
app.use("/api/collections", collectionsRoutes);
app.use("/api/profile", profileRoutes);

// Health check
app.get("/api/health", (_req: Request, res: Response) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Global error handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal server error" });
});

const PORT = parseInt(process.env.PORT || "5000", 10);
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
