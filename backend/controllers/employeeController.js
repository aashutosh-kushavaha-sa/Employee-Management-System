const Employee = require("../models/employeeModel");

// Add New Employee
exports.addEmployee = async (req, res) => {
  try {
    const { name,age , gender , email, position, department, salary } = req.body;

    // Check if employee already exists
    const existing = await Employee.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Employee already exists" });
    }

    const employee = await Employee.create({
      name,
      age,
      gender,
      email,
      position,
      department,
      salary,
    });

    res.status(201).json({
      message: "Employee added successfully",
      employee,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//  Get All Employees
exports.getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find();
    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//  Get Single Employee by ID
exports.getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    res.status(200).json(employee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Employee by ID
exports.updateEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.status(200).json({
      message: "Employee updated successfully",
      employee,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 5️ Delete Employee by ID
exports.deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.status(200).json({ message: "Employee deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
