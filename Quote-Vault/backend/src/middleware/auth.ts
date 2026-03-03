import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import type { AuthRequest } from "../types/index.js";

interface JwtPayload {
  id: string;
}

// Protect routes - verify JWT token
export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    let token: string | undefined;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      res.status(401).json({ error: "Not authorized, no token provided" });
      return;
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string,
    ) as JwtPayload;

    const user = await User.findById(decoded.id);
    if (!user) {
      res.status(401).json({ error: "Not authorized, user not found" });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    const err = error as Error;
    console.error("Auth middleware error:", err.message);
    res.status(401).json({ error: "Not authorized, token invalid" });
  }
};

// Generate JWT token
export const generateToken = (userId: string | object): string => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET as string, {
    expiresIn: (process.env.JWT_EXPIRES_IN as string) || "7d",
  });
};
