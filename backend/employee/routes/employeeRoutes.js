const express = require("express");
const routes = express.Router();


const authMiddleware = require("..//../middleware/authMiddleware"); 

const {
  addEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
} = require("../controllers/employeeController");

// Proper REST API routes
routes.post("/add", authMiddleware , addEmployee);                     // CREATE
routes.get("/getall", authMiddleware , getAllEmployees);               // READ (all)
routes.get("/getone/:id", authMiddleware , getEmployeeById);           // READ (one)
routes.put("/update/:id", authMiddleware , updateEmployee);            // UPDATE
routes.delete("/delete/:id", authMiddleware , deleteEmployee);         // DELETE

module.exports = routes;
