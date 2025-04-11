require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./database/db");
const { initializeDatabase } = require("./database/schema");
const userRoutes = require("./routes/users");
const taskRoutes = require("./routes/tasks");
const errorHandler = require("./middleware/errorHandler");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.get("/", async (req, res) => {
  res.json({ message: "Welcome to the Meatec Task Management API" });
});

// API Routes
app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);

// Error handler middleware (must be after all routes)
app.use(errorHandler);

// Handle 404 errors for routes that don't exist
app.use((req, res) => {
  res.status(404).json({ message: "Endpoint not found" });
});

// Start the server
app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);

  try {
    // Test database connection
    const version = await db.testConnection();
    console.log(`Connected to database: ${version}`);

    // Initialize database schema
    await initializeDatabase();
    console.log("Database schema initialized");
  } catch (err) {
    console.error("Failed to connect to database:", err);
    process.exit(1);
  }
});
