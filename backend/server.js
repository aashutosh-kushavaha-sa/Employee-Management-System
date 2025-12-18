require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const logger = require("./utils/logger");
const errorHandler = require("./middleware/errorHandler");

const app = express();
app.use(cors());
app.use(express.json());

// Connect DB
connectDB();

// Load routes safely
try {
  const authRoutes = require("./routes/auth.routes");
  app.use("/api/auth", authRoutes);
} catch (e) {
  logger.warn("auth.routes failed to load: " + e.message);
}

try {
  const empRoutes = require("./routes/employee.routes");
  app.use("/api/employee", empRoutes);
} catch (e) {
  logger.warn("employee.routes failed to load: " + e.message);
}

// Default route
app.get("/", (req, res) => {
  res.send("EMS API running");
});

// PORT
const PORT = process.env.PORT || 5000;

// Start server
const server = app.listen(PORT, () =>
  logger.info(`Server started on port ${PORT}`)
);

// Handle server errors
server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    logger.error(
      `Port ${PORT} is already in use. Please free the port or change PORT in .env`
    );
    process.exit(1);
  } else {
    logger.error(err);
    process.exit(1);
  }
});

// Global error handler (should be last)
app.use(errorHandler);

// Handle unhandled errors
process.on("uncaughtException", (err) => {
  logger.error("Uncaught Exception: " + (err.stack || err));
  process.exit(1);
});

process.on("unhandledRejection", (reason) => {
  logger.error(
    "Unhandled Rejection: " + (reason && (reason.stack || reason))
  );
});
