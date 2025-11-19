const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");

// Load environment variables
dotenv.config();

// Connect to the database
connectDB();

const app = express();

app.use(express.json());

// 1. Enable CORS for all origins (for development)
app.use(cors({
    origin: 'http://localhost:4200' // Change this to your Angular dev server port
}));

// Routes /api/auth/signUp
app.use("/api/auth", userRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
});