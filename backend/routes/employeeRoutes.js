const express = require("express");
const Employee = require("../models/Employee");

const router = express.Router();

const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// Get all employees
router.get("/", async (req, res) => {
  try {
    const employees = await Employee.find().sort({
      createdAt: -1
    });

    res.json(employees);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch employees"
    });
  }
});

// Get single employee
router.get("/:id", async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({
        message: "Employee not found"
      });
    }

    res.json(employee);
  } catch (error) {
    res.status(400).json({
      message: "Invalid employee ID"
    });
  }
});

// Create employee
router.post("/", async (req, res) => {
  try {
    const {
      name,
      email,
      department,
      designation
    } = req.body;

    if (
      !name?.trim() ||
      !email?.trim() ||
      !department?.trim() ||
      !designation?.trim()
    ) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        message: "Please enter a valid email address"
      });
    }

    const existingEmployee = await Employee.findOne({
      email: email.toLowerCase().trim()
    });

    if (existingEmployee) {
      return res.status(400).json({
        message: "An employee with this email already exists"
      });
    }

    const employee = await Employee.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      department: department.trim(),
      designation: designation.trim()
    });

    res.status(201).json(employee);

  } catch (error) {
    res.status(500).json({
      message: "Failed to create employee"
    });
  }
});

// Update employee
router.put("/:id", async (req, res) => {
  try {
    const {
      name,
      email,
      department,
      designation
    } = req.body;

    if (
      !name?.trim() ||
      !email?.trim() ||
      !department?.trim() ||
      !designation?.trim()
    ) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        message: "Please enter a valid email address"
      });
    }

    const existingEmployee = await Employee.findOne({
      email: email.toLowerCase().trim(),
      _id: { $ne: req.params.id }
    });

    if (existingEmployee) {
      return res.status(400).json({
        message: "Another employee already uses this email"
      });
    }

    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        department: department.trim(),
        designation: designation.trim()
      },
      {
        new: true,
        runValidators: true
      }
    );

    if (!employee) {
      return res.status(404).json({
        message: "Employee not found"
      });
    }

    res.json(employee);

  } catch (error) {
    res.status(400).json({
      message: "Unable to update employee"
    });
  }
});

// Delete employee
router.delete("/:id", async (req, res) => {
  try {
    const employee = await Employee.findByIdAndDelete(
      req.params.id
    );

    if (!employee) {
      return res.status(404).json({
        message: "Employee not found"
      });
    }

    res.json({
      message: "Employee deleted successfully"
    });

  } catch (error) {
    res.status(400).json({
      message: "Unable to delete employee"
    });
  }
});

module.exports = router;