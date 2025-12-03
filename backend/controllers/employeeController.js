const employeeService = require('../services/employeeService');
const asyncHandler = require('../utils/asyncHandler');
exports.addEmployee = asyncHandler(async (req, res) => {
  const result = await employeeService.addEmployee(req.body);
  if (!result.success) return res.status(400).json({ message: result.message });
  res.status(201).json({ message: 'Employee added successfully', employee: result.employee });
});
exports.getAllEmployees = asyncHandler(async (req, res) => {
  const { page, limit } = req.query;
  const result = await employeeService.getAllEmployees({ page, limit });
  res.status(200).json(result);
});
exports.getEmployeeById = asyncHandler(async (req, res) => {
  const emp = await employeeService.getEmployeeById(req.params.id);
  if (!emp) return res.status(404).json({ message: 'Employee not found' });
  res.status(200).json(emp);
});
exports.updateEmployee = asyncHandler(async (req, res) => {
  const emp = await employeeService.updateEmployee(req.params.id, req.body);
  if (!emp) return res.status(404).json({ message: 'Employee not found' });
  res.status(200).json({ message: 'Employee updated', employee: emp });
});
exports.deleteEmployee = asyncHandler(async (req, res) => {
  const emp = await employeeService.deleteEmployee(req.params.id);
  if (!emp) return res.status(404).json({ message: 'Employee not found' });
  res.status(200).json({ message: 'Employee deleted' });
});
