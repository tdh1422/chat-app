const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // Kết nối tới MongoDB
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1); // Thoát ứng dụng nếu kết nối thất bại
  }
};

module.exports = connectDB;