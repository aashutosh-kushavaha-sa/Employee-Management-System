const Admin = require("../models/adminModel");
const jwt = require("jsonwebtoken");

// Generate JWT Token
const generateToken = (id, name) => {
  return jwt.sign({ id, name }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

exports.createAdmin = async (data) => {
  return await Admin.create(data);
};

exports.loginAdmin = async (email, password) => {
  const admin = await Admin.findOne({ email }).select("+password");

  if (!admin) {
    return { success: false, message: "Invalid email or password" };
  }

  const isMatch = await admin.correctPassword(password, admin.password);

  if (!isMatch) {
    return { success: false, message: "Invalid email or password" };
  }

  // Generate token
  const token = generateToken(admin._id, admin.name);

  return {
    success: true,
    token,
    admin: { id: admin._id, name: admin.name, email: admin.email },
  };
};
