import express from "express";
import { db } from "../config/db.js";
import { auth, adminOnly } from "../middleware/auth.js";

const router = express.Router();

// Create event (admin)
router.post("/events", auth, adminOnly, async (req, res) => {
  try {
    const { title, description, event_date, location, category, image_url } = req.body || {};
    if (!title || !description || !event_date || !location || !category) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const [result] = await db.query(
      `INSERT INTO events (title, description, event_date, location, category, image_url, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [title, description, event_date, location, category, image_url || null, req.user.id]
    );

    const [rows] = await db.query("SELECT * FROM events WHERE id = ?", [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Delete event (admin)
router.delete("/events/:id", auth, adminOnly, async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ error: "Bad id" });

    const [result] = await db.query("DELETE FROM events WHERE id = ?", [id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: "Not found" });

    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
