require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bugRoutes = require("./src/routes/bugRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "Bug Triage API is running 🚀" });
});

// Routes
app.use("/api/bugs", bugRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});