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

app.use(express.json());
app.use(cors());

app.get("/", async (req, res) => {
  res.json({ message: "Welcome to the Meatec Task Management API" });
});

app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);

app.use(errorHandler);

app.use((req, res) => {
  res.status(404).json({ message: "Endpoint not found" });
});

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);

  try {
    const version = await db.testConnection();
    console.log(`Connected to database: ${version}`);

    await initializeDatabase();
    console.log("Database schema initialized");
  } catch (err) {
    console.error("Failed to connect to database:", err);
    process.exit(1);
  }
});
