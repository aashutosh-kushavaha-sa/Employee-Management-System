const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Define User Schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your name"],
  },
  email: {
    type: String,
    required: [true, "Please enter your email"],
    unique: true, // email must be unique
    lowercase: true, // convert to lowercase
  },
  password: {
    type: String,
    required: [true, "Please enter a password"],
    minlength: 6, // basic validation
    select: false, // password will not show by default in query
  },
});

// Encrypt password before saving user document
userSchema.pre("save", async function (next) {
  // Only run if password is modified or new
  if (!this.isModified("password")) return next();

  // Hash password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  next();
});

// Compare entered password with stored (hashed) password
userSchema.methods.correctPassword = async function (enteredPassword, storedPassword) {
  return await bcrypt.compare(enteredPassword, storedPassword);
};

// Create and export model
const User = mongoose.model("User", userSchema);
module.exports = User;
