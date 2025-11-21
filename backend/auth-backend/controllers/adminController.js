const Admin = require("../models/adminModel");
const jwt = require("jsonwebtoken");

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};


//create a new Admin
exports.createAdmin = async (req,res) =>{
    try {
        const admin = await Admin.create(req.body);
        res.status(201).json(admin)
    } catch (error) {
        res.status(500).json({message : error.message})
    }
}

// Login Admin
exports.loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Check if admin exists
    const admin = await Admin.findOne({ email }).select("+password"); // include password field

    if (!admin) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // 2. Check if password matches
    const isMatch = await admin.correctPassword(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // 3. Send token
    const token = generateToken(admin._id);
    res.status(200).json({
      message: "Login successful",
      token,
      admin: { id: admin._id, name: admin.name, email: admin.email },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};