import { Router, Response } from "express";
import Profile from "../models/Profile.js";
import { protect } from "../middleware/auth.js";
import type { AuthRequest, IUserSettings } from "../types/index.js";

const router = Router();

// All profile routes require authentication
router.use(protect);

// Default settings (mirrors profileService.ts defaultSettings)
const defaultSettings: IUserSettings = {
  theme: "light",
  accentColor: "#007AFF",
  fontSize: "medium",
  notificationsEnabled: true,
  notificationHour: 9,
  notificationMinute: 0,
};

// ─── GET /api/profile ───────────────────────────────────────────────────────
router.get("/", async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!._id;

    const profile = await Profile.findOne({ user: userId });

    if (!profile) {
      res.json({ data: null });
      return;
    }

    const mergedSettings: IUserSettings = {
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
router.put(
  "/settings",
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user!._id;
      const newSettings = req.body.settings as Partial<IUserSettings>;

      if (!newSettings) {
        res.status(400).json({ error: "Settings object is required" });
        return;
      }

      let profile = await Profile.findOne({ user: userId });

      if (profile) {
        const currentSettings = profile.settings.toObject();
        const updatedSettings = { ...currentSettings, ...newSettings };
        profile.settings = updatedSettings as IUserSettings;
        await profile.save();
      } else {
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
  },
);

// ─── PUT /api/profile/display-name ──────────────────────────────────────────
router.put(
  "/display-name",
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user!._id;
      const { displayName } = req.body;

      const profile = await Profile.findOneAndUpdate(
        { user: userId },
        { displayName },
        { new: true, upsert: true, setDefaultsOnInsert: true },
      );

      res.json({ success: true, displayName: profile!.displayName });
    } catch (error) {
      console.error("Error updating display name:", error);
      res.status(500).json({ error: "Error updating display name" });
    }
  },
);

// ─── PUT /api/profile/avatar ────────────────────────────────────────────────
router.put(
  "/avatar",
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user!._id;
      const { avatarUrl } = req.body;

      const profile = await Profile.findOneAndUpdate(
        { user: userId },
        { avatarUrl },
        { new: true, upsert: true, setDefaultsOnInsert: true },
      );

      res.json({ success: true, avatarUrl: profile!.avatarUrl });
    } catch (error) {
      console.error("Error updating avatar:", error);
      res.status(500).json({ error: "Error updating avatar" });
    }
  },
);

// ─── POST /api/profile/sync ────────────────────────────────────────────────
router.post("/sync", async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!._id;
    const { localSettings } = req.body as {
      localSettings?: Partial<IUserSettings>;
    };

    const profile = await Profile.findOne({ user: userId });

    if (profile?.settings) {
      const mergedSettings: IUserSettings = {
        ...defaultSettings,
        ...profile.settings.toObject(),
      };
      res.json({ data: mergedSettings, source: "server" });
      return;
    }

    const settingsToSave: IUserSettings = {
      ...defaultSettings,
      ...localSettings,
    };

    await Profile.findOneAndUpdate(
      { user: userId },
      { settings: settingsToSave },
      { upsert: true, setDefaultsOnInsert: true },
    );

    res.json({ data: settingsToSave, source: "local" });
  } catch (error) {
    console.error("Error syncing settings:", error);
    res.status(500).json({
      error: "Error syncing settings",
      data: { ...defaultSettings, ...(req.body.localSettings || {}) },
    });
  }
});

export default router;
