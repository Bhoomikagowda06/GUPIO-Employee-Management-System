const express = require("express");
const router = express.Router();
const Employee = require("../models/Employee");

// Create Employee
router.post("/", async (req, res) => {
  try {
    console.log("Received employee data:", req.body);

    const { name, email, department, designation } = req.body;

    if (!name || !email || !department || !designation) {
      return res.status(400).json({
        message: "Please fill all required fields"
      });
    }

    const employee = new Employee({
      name,
      email,
      department,
      designation
    });

    const savedEmployee = await employee.save();

    res.status(201).json({
      message: "Employee created successfully",
      employee: savedEmployee
    });

  } catch (error) {
    console.error("Create employee error:", error);

    res.status(500).json({
      message: "Failed to create employee",
      error: error.message
    });
  }
});

// Get Employees
router.get("/", async (req, res) => {
  try {
    const employees = await Employee.find().sort({ createdAt: -1 });

    res.json(employees);

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch employees",
      error: error.message
    });
  }
});

// Delete Employee
router.delete("/:id", async (req, res) => {
  try {
    const deletedEmployee = await Employee.findByIdAndDelete(req.params.id);

    if (!deletedEmployee) {
      return res.status(404).json({
        message: "Employee not found"
      });
    }

    res.json({
      message: "Employee deleted successfully"
    });

  } catch (error) {
    console.error("Delete employee error:", error);

    res.status(500).json({
      message: "Failed to delete employee",
      error: error.message
    });
  }
});

module.exports = router;