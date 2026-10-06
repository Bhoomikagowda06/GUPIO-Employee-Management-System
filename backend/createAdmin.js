const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

require("dotenv").config();

const createAdmin = async () => {
  try {
    console.log("Connecting to database...");

    await mongoose.connect(process.env.MONGODB_URI || process.env.MONGO_URI);

    const hashedPassword = await bcrypt.hash("admin123", 10);

    const existingAdmin = await User.findOne({
      email: "admin@gupio.com"
    });

    if (existingAdmin) {
      console.log("Admin already exists");
      process.exit();
    }

    await User.create({
      name: "GUPIO Admin",
      email: "admin@gupio.com",
      password: hashedPassword,
      role: "admin"
    });

    console.log("Admin created successfully");
    process.exit();

  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
};

createAdmin();