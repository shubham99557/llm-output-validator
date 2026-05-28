require("dotenv").config();

const express = require("express");
const cors = require("cors");

require("./database");

// ROUTES
const schemaRoutes = require("./routes/schemaRoutes");
const callRoutes = require("./routes/callRoutes");
const failureRoutes = require("./routes/failureRoutes");
const authRoutes = require("./routes/auth");
const metricsRoutes = require("./routes/metricsRoutes");

const app = express();

/* ---------------- MIDDLEWARE ---------------- */

// CORS (production-safe structure)
app.use(
  cors({
    origin: "*", // 🔒 later replace with frontend domain
    credentials: true,
  })
);

// JSON parser (safe limit for LLM responses)
app.use(express.json({ limit: "10mb" }));

// Request logger (SaaS debugging)
app.use((req, res, next) => {
  console.log(`➡️ ${req.method} ${req.url}`);
  next();
});

/* ---------------- ROUTES ---------------- */

app.use("/auth", authRoutes);
app.use("/schemas", schemaRoutes);
app.use("/call", callRoutes);
app.use("/failures", failureRoutes);
app.use("/metrics", metricsRoutes);

/* ---------------- HEALTH CHECK ---------------- */

app.get("/", (req, res) => {
  res.json({
    status: "ok",
    message: "LLM Output Validator Backend Running 🚀",
  });
});

/* ---------------- ERROR HANDLER ---------------- */

app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err);

  res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
});

/* ---------------- START SERVER ---------------- */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});