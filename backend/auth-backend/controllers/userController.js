const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};


//create a new User
exports.createUser = async (req,res) =>{
    try {
        const user = await User.create(req.body);
        res.status(201).json(user)
    } catch (error) {
        res.status(500).json({message : error.message})
    }
}

// Login User
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Check if user exists
    const user = await User.findOne({ email }).select("+password"); // include password field

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // 2. Check if password matches
    const isMatch = await user.correctPassword(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // 3. Send token
    const token = generateToken(user._id);
    res.status(200).json({
      message: "Login successful",
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};