const express = require("express");
const Profile = require("../models/Profile");
const { protect } = require("../middleware/auth");

const router = express.Router();

// All profile routes require authentication
router.use(protect);

// Default settings (mirrors profileService.ts defaultSettings)
const defaultSettings = {
  theme: "light",
  accentColor: "#007AFF",
  fontSize: "medium",
  notificationsEnabled: true,
  notificationHour: 9,
  notificationMinute: 0,
};

// ─── GET /api/profile ───────────────────────────────────────────────────────
// Mirrors: getUserProfile(userId)
router.get("/", async (req, res) => {
  try {
    const userId = req.user._id;

    let profile = await Profile.findOne({ user: userId });

    if (!profile) {
      // Return null with defaults (matches Supabase behavior)
      return res.json({ data: null });
    }

    // Merge with default settings for any missing fields
    const mergedSettings = {
      ...defaultSettings,
      ...profile.settings.toObject(),
    };

    res.json({
      data: {
        id: profile.user,
        displayName: profile.displayName,
        avatarUrl: profile.avatarUrl,
        settings: mergedSettings,
        createdAt: profile.createdAt,
        updatedAt: profile.updatedAt,
      },
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ error: "Error fetching profile" });
  }
});

// ─── PUT /api/profile/settings ──────────────────────────────────────────────
// Mirrors: updateUserSettings(userId, settings)
router.put("/settings", async (req, res) => {
  try {
    const userId = req.user._id;
    const newSettings = req.body.settings;

    if (!newSettings) {
      return res.status(400).json({ error: "Settings object is required" });
    }

    let profile = await Profile.findOne({ user: userId });

    if (profile) {
      // Merge existing settings with new ones
      const currentSettings = profile.settings.toObject();
      const updatedSettings = { ...currentSettings, ...newSettings };
      profile.settings = updatedSettings;
      await profile.save();
    } else {
      // Create profile with settings (upsert behavior)
      profile = await Profile.create({
        user: userId,
        settings: { ...defaultSettings, ...newSettings },
      });
    }

    res.json({ success: true, data: profile.settings });
  } catch (error) {
    console.error("Error updating settings:", error);
    res.status(500).json({ error: "Error updating settings" });
  }
});

// ─── PUT /api/profile/display-name ──────────────────────────────────────────
// Mirrors: updateDisplayName(userId, displayName)
router.put("/display-name", async (req, res) => {
  try {
    const userId = req.user._id;
    const { displayName } = req.body;

    const profile = await Profile.findOneAndUpdate(
      { user: userId },
      { displayName },
      { new: true, upsert: true, setDefaultsOnInsert: true },
    );

    res.json({ success: true, displayName: profile.displayName });
  } catch (error) {
    console.error("Error updating display name:", error);
    res.status(500).json({ error: "Error updating display name" });
  }
});

// ─── PUT /api/profile/avatar ────────────────────────────────────────────────
// Mirrors: updateAvatar(userId, avatarUrl)
router.put("/avatar", async (req, res) => {
  try {
    const userId = req.user._id;
    const { avatarUrl } = req.body;

    const profile = await Profile.findOneAndUpdate(
      { user: userId },
      { avatarUrl },
      { new: true, upsert: true, setDefaultsOnInsert: true },
    );

    res.json({ success: true, avatarUrl: profile.avatarUrl });
  } catch (error) {
    console.error("Error updating avatar:", error);
    res.status(500).json({ error: "Error updating avatar" });
  }
});

// ─── POST /api/profile/sync ────────────────────────────────────────────────
// Mirrors: syncSettingsOnLogin(userId, localSettings)
router.post("/sync", async (req, res) => {
  try {
    const userId = req.user._id;
    const { localSettings } = req.body;

    const profile = await Profile.findOne({ user: userId });

    if (profile && profile.settings) {
      // Server has settings, return them (server takes precedence)
      const mergedSettings = {
        ...defaultSettings,
        ...profile.settings.toObject(),
      };
      return res.json({ data: mergedSettings, source: "server" });
    } else {
      // No server settings, upload local settings
      const settingsToSave = { ...defaultSettings, ...localSettings };

      await Profile.findOneAndUpdate(
        { user: userId },
        { settings: settingsToSave },
        { upsert: true, setDefaultsOnInsert: true },
      );

      return res.json({ data: settingsToSave, source: "local" });
    }
  } catch (error) {
    console.error("Error syncing settings:", error);
    res.status(500).json({
      error: "Error syncing settings",
      data: { ...defaultSettings, ...(req.body.localSettings || {}) },
    });
  }
});

module.exports = router;
