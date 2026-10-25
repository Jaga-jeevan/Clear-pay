const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const helmet = require("helmet");
const compression = require("compression");
const cookieParser = require("cookie-parser");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const morgan = require("morgan");

const connectDB = require("./config/db");

// Routes
const authRoutes = require("./routes/authRoutes");
const otpRoutes = require("./routes/otpRoutes");
const profileRoutes = require("./routes/profileRoutes");
const settingsRoutes = require("./routes/settingsRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const beneficiaryRoutes = require("./routes/beneficiaryRoutes");
const adminRoutes = require("./routes/adminRoutes");

// Middleware
const notFound = require("./middleware/notFound");
const errorHandler = require("./middleware/errorHandler");

// ==========================
// Environment
// ==========================
dotenv.config();

// ==========================
// Database
// ==========================
connectDB();

const app = express();

// ==========================
// Express Settings
// ==========================
app.disable("x-powered-by");
app.set("trust proxy", 1);

// ==========================
// Global Middleware
// ==========================
app.use(helmet());

app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    credentials: true,
  })
);

app.use(compression());

app.use(cookieParser());

app.use(express.json({ limit: "10mb" }));

app.use(
  express.urlencoded({
    extended: true,
    limit: "10mb",
  })
);

app.use(mongoSanitize());

app.use(xss());

app.use(hpp());

app.use(morgan("dev"));

// ==========================
// API Routes
// ==========================
app.use("/api/auth", authRoutes);

app.use("/api/otp", otpRoutes);

app.use("/api/profile", profileRoutes);

app.use("/api/settings", settingsRoutes);

app.use("/api/transactions", transactionRoutes);

app.use("/api/beneficiaries", beneficiaryRoutes);

app.use("/api/admin", adminRoutes);

// ==========================
// Health Check
// ==========================
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    status: "OK",
    message: "NexusBank API is running",
    environment: process.env.NODE_ENV || "development",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// ==========================
// Error Handling
// ==========================
app.use(notFound);

app.use(errorHandler);

// ==========================
// Server
// ==========================
const PORT = Number(process.env.PORT) || 5000;

const server = app.listen(PORT, () => {
  console.log(
    `🚀 Server running on http://localhost:${PORT}`
  );
});

// ==========================
// Graceful Shutdown
// ==========================
process.on("SIGINT", () => {
  console.log("\n🛑 Shutting down server...");

  server.close(() => {
    console.log("✅ Server closed.");
    process.exit(0);
  });
});