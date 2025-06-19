// what the helly?

import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { prisma } from "./lib/prisma"; // since we set up the prisma client in the lib folder, we can import it her elike this.

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

app.listen(PORT, () =>
  console.log(`🚀 Backend running on http://localhost:${PORT}`)
);
