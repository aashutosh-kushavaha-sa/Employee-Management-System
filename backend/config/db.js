const mongoose = require("mongoose");
const logger = require("../utils/logger");

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/ems";

    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    logger.info("MongoDB connected");
  } catch (err) {
    logger.error("MongoDB connection error: " + (err.message || err));
    process.exit(1);
  }
};

module.exports = connectDB;
