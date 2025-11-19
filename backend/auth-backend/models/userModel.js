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
    select: false, 
  },
  passwordConfirm: {
    type: String,
    select: false,
  },
  
});

//  Password Confirmation Check and Hashing Logic 
userSchema.pre("save", async function (next) {
  // Only run if password is modified or new
  if (!this.isModified("password")) return next();

  if (this.passwordConfirm && this.password !== this.passwordConfirm) {
    const error = new Error('Passwords are not the same!');
    return next(error); 
  }

  //  Hash password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  this.passwordConfirm = undefined;

  next();
});

// Compare entered password with stored (hashed) password
userSchema.methods.correctPassword = async function (enteredPassword, storedPassword) {
  return await bcrypt.compare(enteredPassword, storedPassword);
};

// Create and export model
const User = mongoose.model("User", userSchema);
module.exports = User;