const mongoose = require("mongoose");

// Define Employee Schema
const employeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter employee name"],
  },
  email: {
    type: String,
    required: [true, "Please enter employee email"],
    unique: true,
    lowercase: true,
  },
  position: {
    type: String,
    required: [true, "Please enter employee position"],
  },
  department: {
    type: String,
    required: [true, "Please enter employee department"],
  },
  salary: {
    type: Number,
    required: [true, "Please enter employee salary"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create and export model
const Employee = mongoose.model("Employee", employeeSchema);
module.exports = Employee;
