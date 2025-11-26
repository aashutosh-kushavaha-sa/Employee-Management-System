const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const adminRoutes = require("./routes/adminRoutes");

// Load environment variables
dotenv.config();

// Connect to the database
connectDB();

const app = express();

app.use(express.json());

// 1. Enable CORS for all origins 
app.use(cors({
    origin: 'http://localhost:4200' 
}));

// Routes /api/auth/signUp
app.use("/api/auth", adminRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
});