const Employee = require("../models/employeeModel");

exports.addEmployee = async (data) => {
  const exists = await Employee.findOne({ email: data.email });
  if (exists) {
    return { success: false, message: "Employee already exists" };
  }

  const employee = await Employee.create(data);

  return { success: true, employee };
};

exports.getAllEmployees = async () => {
  return await Employee.find();
};

exports.getEmployeeById = async (id) => {
  return await Employee.findById(id);
};

exports.updateEmployee = async (id, data) => {
  const employee = await Employee.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
  return employee;
};

exports.deleteEmployee = async (id) => {
  return await Employee.findByIdAndDelete(id);
};
