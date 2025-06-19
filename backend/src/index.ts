// what the helly?

import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { prisma } from "./lib/prisma";
// import { requireAuth, optionalAuth } from "./middleware/auth"; // Commented out until Clerk is installed

// load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// cors setup.
app.use(express.json());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true,
  })
);

// example health-check
/* app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
}); */

app.get("/api/health", async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({
      status: "ok",
      database: "connected",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      database: "disconnected",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Public endpoint
app.get("/api/users", async (_req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// Test protected endpoint (we'll add proper ones later)
app.get("/api/protected", (req, res) => {
  // For now, just return a simple response
  // We'll add proper auth later once packages are installed
  res.json({
    message: "This will be a protected route!",
    note: "Install Clerk packages first",
  });
});

app.listen(PORT, () =>
  console.log(`🚀 Backend running on http://localhost:${PORT}`)
);
