import { Router, Response } from "express";
import crypto from "crypto";
import { body, validationResult } from "express-validator";
import User from "../models/User.js";
import Profile from "../models/Profile.js";
import { protect, generateToken } from "../middleware/auth.js";
import type { AuthRequest } from "../types/index.js";

const router = Router();

// ─── POST /api/auth/signup ───────────────────────────────────────────────────
router.post(
  "/signup",
  [
    body("email").isEmail().withMessage("Please enter a valid email"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
  ],
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ error: errors.array()[0].msg });
        return;
      }

      const { email, password, name } = req.body;

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        res.status(400).json({ error: "User already exists with this email" });
        return;
      }

      const user = await User.create({ email, password });

      // Auto-create profile (mirrors Supabase trigger: on_auth_user_created)
      await Profile.create({
        user: user._id,
        displayName: name || null,
      });

      const token = generateToken(user._id);

      res.status(201).json({
        token,
        user: { id: user._id, email: user.email },
      });
    } catch (error) {
      console.error("Signup error:", error);
      res.status(500).json({ error: "Error creating account" });
    }
  },
);

// ─── POST /api/auth/signin ──────────────────────────────────────────────────
router.post(
  "/signin",
  [
    body("email").isEmail().withMessage("Please enter a valid email"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ error: errors.array()[0].msg });
        return;
      }

      const { email, password } = req.body;

      const user = await User.findOne({ email }).select("+password");
      if (!user) {
        res.status(401).json({ error: "Invalid email or password" });
        return;
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        res.status(401).json({ error: "Invalid email or password" });
        return;
      }

      const token = generateToken(user._id);

      res.json({
        token,
        user: { id: user._id, email: user.email },
      });
    } catch (error) {
      console.error("Signin error:", error);
      res.status(500).json({ error: "Error signing in" });
    }
  },
);

// ─── POST /api/auth/reset-password ──────────────────────────────────────────
router.post(
  "/reset-password",
  [body("email").isEmail().withMessage("Please enter a valid email")],
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ error: errors.array()[0].msg });
        return;
      }

      const { email } = req.body;
      const user = await User.findOne({ email }).select(
        "+resetPasswordToken +resetPasswordExpires",
      );

      if (!user) {
        res.json({
          message: "If that email exists, a reset link has been sent",
        });
        return;
      }

      const resetToken = crypto.randomBytes(32).toString("hex");
      const hashedToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

      user.resetPasswordToken = hashedToken;
      user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000);
      await user.save({ validateBeforeSave: false });

      console.log(`Password reset token for ${email}: ${resetToken}`);

      res.json({ message: "If that email exists, a reset link has been sent" });
    } catch (error) {
      console.error("Reset password error:", error);
      res.status(500).json({ error: "Error processing password reset" });
    }
  },
);

// ─── PUT /api/auth/reset-password/:token ────────────────────────────────────
router.put(
  "/reset-password/:token",
  [
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
  ],
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ error: errors.array()[0].msg });
        return;
      }

      const hashedToken = crypto
        .createHash("sha256")
        .update(req.params.token)
        .digest("hex");

      const user = await User.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpires: { $gt: Date.now() },
      }).select("+resetPasswordToken +resetPasswordExpires +password");

      if (!user) {
        res.status(400).json({ error: "Invalid or expired reset token" });
        return;
      }

      user.password = req.body.password;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();

      const token = generateToken(user._id);

      res.json({
        token,
        user: { id: user._id, email: user.email },
        message: "Password reset successful",
      });
    } catch (error) {
      console.error("Reset password confirm error:", error);
      res.status(500).json({ error: "Error resetting password" });
    }
  },
);

// ─── GET /api/auth/me ────────────────────────────────────────────────────────
router.get(
  "/me",
  protect,
  async (req: AuthRequest, res: Response): Promise<void> => {
    res.json({
      user: { id: req.user!._id, email: req.user!.email },
    });
  },
);

export default router;
