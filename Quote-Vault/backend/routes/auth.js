const express = require("express");
const crypto = require("crypto");
const { body, validationResult } = require("express-validator");
const User = require("../models/User");
const Profile = require("../models/Profile");
const { protect, generateToken } = require("../middleware/auth");

const router = express.Router();

// ─── POST /api/auth/signup ───────────────────────────────────────────────────
// Mirrors: supabase.auth.signUp({ email, password })
router.post(
  "/signup",
  [
    body("email").isEmail().withMessage("Please enter a valid email"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array()[0].msg });
      }

      const { email, password, name } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res
          .status(400)
          .json({ error: "User already exists with this email" });
      }

      // Create user
      const user = await User.create({ email, password });

      // Auto-create profile (mirrors Supabase trigger: on_auth_user_created)
      await Profile.create({
        user: user._id,
        displayName: name || null,
      });

      // Generate token
      const token = generateToken(user._id);

      res.status(201).json({
        token,
        user: {
          id: user._id,
          email: user.email,
        },
      });
    } catch (error) {
      console.error("Signup error:", error);
      res.status(500).json({ error: "Error creating account" });
    }
  },
);

// ─── POST /api/auth/signin ──────────────────────────────────────────────────
// Mirrors: supabase.auth.signInWithPassword({ email, password })
router.post(
  "/signin",
  [
    body("email").isEmail().withMessage("Please enter a valid email"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array()[0].msg });
      }

      const { email, password } = req.body;

      // Find user with password field
      const user = await User.findOne({ email }).select("+password");
      if (!user) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      // Check password
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      // Generate token
      const token = generateToken(user._id);

      res.json({
        token,
        user: {
          id: user._id,
          email: user.email,
        },
      });
    } catch (error) {
      console.error("Signin error:", error);
      res.status(500).json({ error: "Error signing in" });
    }
  },
);

// ─── POST /api/auth/reset-password ──────────────────────────────────────────
// Mirrors: supabase.auth.resetPasswordForEmail(email)
// Generates a reset token (in production, send via email)
router.post(
  "/reset-password",
  [body("email").isEmail().withMessage("Please enter a valid email")],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array()[0].msg });
      }

      const { email } = req.body;
      const user = await User.findOne({ email }).select(
        "+resetPasswordToken +resetPasswordExpires",
      );

      if (!user) {
        // Don't reveal whether user exists
        return res.json({
          message: "If that email exists, a reset link has been sent",
        });
      }

      // Generate reset token
      const resetToken = crypto.randomBytes(32).toString("hex");
      const hashedToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

      user.resetPasswordToken = hashedToken;
      user.resetPasswordExpires = Date.now() + 60 * 60 * 1000; // 1 hour
      await user.save({ validateBeforeSave: false });

      // In production, send email with resetToken
      // For now, return the token (remove in production!)
      console.log(`Password reset token for ${email}: ${resetToken}`);

      // TODO: Send email using nodemailer
      // const resetUrl = `quotevault://reset-password?token=${resetToken}`;
      // await sendEmail({ to: email, subject: 'Password Reset', text: `Reset link: ${resetUrl}` });

      res.json({ message: "If that email exists, a reset link has been sent" });
    } catch (error) {
      console.error("Reset password error:", error);
      res.status(500).json({ error: "Error processing password reset" });
    }
  },
);

// ─── PUT /api/auth/reset-password/:token ────────────────────────────────────
// Complete password reset with token
router.put(
  "/reset-password/:token",
  [
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array()[0].msg });
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
        return res
          .status(400)
          .json({ error: "Invalid or expired reset token" });
      }

      // Update password
      user.password = req.body.password;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();

      // Generate new token
      const token = generateToken(user._id);

      res.json({
        token,
        user: {
          id: user._id,
          email: user.email,
        },
        message: "Password reset successful",
      });
    } catch (error) {
      console.error("Reset password confirm error:", error);
      res.status(500).json({ error: "Error resetting password" });
    }
  },
);

// ─── GET /api/auth/me ────────────────────────────────────────────────────────
// Get current authenticated user
router.get("/me", protect, async (req, res) => {
  res.json({
    user: {
      id: req.user._id,
      email: req.user.email,
    },
  });
});

module.exports = router;
