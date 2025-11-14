const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const employeeRoutes = require("./routes/employeeRoutes");

// Load environment variables
dotenv.config();

// Connect to the database
connectDB();

//call express
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/employee", employeeRoutes);


const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
