import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { prisma } from "./lib/prisma";
import courseRoutes from "./routes/CourseRoute";
import canvasRoutes from "./routes/CanvasRoute";

// load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// cors setup.
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000", "https://axiomai.space"], // Allowed origins
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Allowed methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
    credentials: true, // Allow cookies/auth headers
  })
);

// Routes
app.use("/api/courses", courseRoutes);
app.use("/api/canvas", canvasRoutes);

// Debug endpoint to check environment
app.get("/api/debug", (_req, res) => {
  res.json({
    nodeEnv: process.env.NODE_ENV,
    port: process.env.PORT,
    corsOrigin: process.env.CORS_ORIGIN,
    databaseUrl: process.env.DATABASE_URL
      ? "SET (hidden for security)"
      : "NOT SET",
    directUrl: process.env.DIRECT_URL ? "SET (hidden for security)" : "NOT SET",
    supabaseUrl: process.env.SUPABASE_URL ? "SET" : "NOT SET",
    timestamp: new Date().toISOString(),
  });
});

// Test basic network connectivity to Supabase
app.get("/api/network-test", async (_req, res) => {
  try {
    const response = await fetch(
      "https://zzczqcseofmpkijszepu.supabase.co/rest/v1/",
      {
        headers: {
          Authorization: `Bearer ${process.env.SUPABASE_ANON_KEY}`,
          apikey: process.env.SUPABASE_ANON_KEY || "",
        },
      }
    );

    res.json({
      status: "network_ok",
      supabaseReachable: true,
      statusCode: response.status,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      status: "network_error",
      supabaseReachable: false,
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString(),
    });
  }
});

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

// Create/sync user endpoint
app.post("/api/users/sync", async (req, res) => {
  try {
    const { id, email, firstName, lastName, name } = req.body;

    if (!id || !email) {
      res.status(400).json({ error: "User ID and email are required" });
      return;
    }

    // Upsert user (create if not exists, update if exists)
    const user = await prisma.user.upsert({
      where: { id },
      update: {
        email,
        firstName: firstName || null,
        lastName: lastName || null,
        name: name || null,
      },
      create: {
        id,
        email,
        firstName: firstName || null,
        lastName: lastName || null,
        name: name || null,
      },
    });

    res.json({
      message: "User synced successfully",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    console.error("Failed to sync user:", error);
    res.status(500).json({ error: "Failed to sync user" });
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

app.post("/api/users", async (req, res) => {
  const {} = req.body;
});

app.listen(PORT, () =>
  console.log(`🚀 Backend running on http://localhost:${PORT}`)
);
