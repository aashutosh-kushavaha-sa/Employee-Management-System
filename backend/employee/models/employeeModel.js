const mongoose = require("mongoose");

// Define Employee Schema
const employeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter employee name"],
  },
  age: {
    type: Number,
    require: [true, "Please enter employee age"],
  },
  gender: {
    type: String,
    require: [true, "Please Select Gender"],
    enum: ["Male", "Female", "Other"],
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
    enum: [
      "Software Engineer",
      "Java Developer",
      "QA Engineer",
      "Network Engineer",
      "HR Executive",
      "Data Analyst",
    ],
  },
  department: {
    type: String,
    required: [true, "Please enter employee department"],
    enum: [
      "Engineering",
      "QA",
      "IT Support",
      "HR",
      "Finance",
      "Sales",
      "Marketing",
      "Data Science",
    ],
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
