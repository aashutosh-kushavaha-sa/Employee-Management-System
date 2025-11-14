const express = require("express");
const routes = express.Router();

const {
  addEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
  dashboard
} = require("../controllers/employeeController");

// Proper REST API routes
routes.post("/add", addEmployee);                     // CREATE
routes.get("/getall", getAllEmployees);               // READ (all)
routes.get("/getone/:id", getEmployeeById);           // READ (one)
routes.put("/update/:id", updateEmployee);            // UPDATE
routes.delete("/delete/:id", deleteEmployee);         // DELETE
routes.get("/dashboard", dashboard);                  // STATISTICS

module.exports = routes;
