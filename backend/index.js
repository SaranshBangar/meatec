require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./database/db");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.get("/", async (req, res) => {
  res.json({ message: "Welcome to the Meatec API" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);

  db.testConnection()
    .then((version) => {
      console.log(`Connected to database: ${version}`);
    })
    .catch((err) => {
      console.error("Failed to connect to database:", err);
    });
});
