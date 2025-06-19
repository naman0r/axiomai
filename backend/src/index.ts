// what the helly?

import express from "express";

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());

// example health-check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.listen(PORT, () =>
  console.log(`🚀 Backend running on http://localhost:${PORT}`)
);
