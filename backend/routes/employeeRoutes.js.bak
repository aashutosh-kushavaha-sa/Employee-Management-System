const express = require("express");
const routes = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  addEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
} = require("../controllers/employeeController");

routes.post("/add", authMiddleware, addEmployee);
routes.get("/getall", authMiddleware, getAllEmployees);
routes.get("/getone/:id", authMiddleware, getEmployeeById);
routes.put("/update/:id", authMiddleware, updateEmployee);
routes.delete("/delete/:id", authMiddleware, deleteEmployee);

module.exports = routes;
