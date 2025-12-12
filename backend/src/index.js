import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import { db } from "./config/db.js";

import authRoutes from "./routes/auth.routes.js";
import adminRoutes from "./routes/admin.routes.js";

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

app.get("/api/health", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT 1 AS ok");
    res.json({ ok: true, db: rows[0].ok });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);

// existing events route is fine if you already have it:
app.get("/api/events", async (req, res) => {
  const [rows] = await db.query(
    `SELECT e.*, u.username AS created_by_username
     FROM events e
     JOIN users u ON u.id = e.created_by
     ORDER BY e.event_date ASC`
  );
  res.json(rows);
});

app.listen(process.env.PORT || 5000, () => {
  console.log(`API running on http://localhost:${process.env.PORT || 5000}`);
});
