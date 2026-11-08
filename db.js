const mongoose = require("mongoose");
const URI = process.env.MONGO_URI;
async function connectDB() {
  try {
    await mongoose.connect(URI);
    console.log("MongoDB Connected");
  } catch (error) {
    console.log("MongoDB Error :", error);
    process.exit(1);
  }
}
module.exports = connectDB;
