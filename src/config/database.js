const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://aarushikoirala207_db_user:3GlsyQqOUWtZVj9Z@nodejs.1pe9ski.mongodb.net/devTinder",
  );
};

module.exports = connectDB;
