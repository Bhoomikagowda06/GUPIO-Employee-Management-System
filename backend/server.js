require("dns").setServers(["8.8.8.8", "1.1.1.1"]);

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const employeeRoutes = require("./routes/employeeRoutes");

const app = express();

// Middleware
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"]
  })
);

app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.json({
    message: "GUPIO Employee Management API is running"
  });
});

// Employee routes
app.use("/api/employees", employeeRoutes);

// Port
const PORT = process.env.PORT || 5000;

// Start server
async function startServer() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("MongoDB connected successfully");

    app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
  }
}

startServer();