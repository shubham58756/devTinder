const mongoose = require("mongoose")

const connectDB = async () => {
  const uri = process.env.MONGO_URI ||
    "mongodb+srv://heyshubhampatel2005_db_user:nttPgTGKe0dO0fF9@cluster0.od1rngk.mongodb.net/devTinder"
  try {
    await mongoose.connect(uri)
    console.log("MongoDB connected")
    return mongoose.connection
  } catch (err) {
    console.error("MongoDB connection error:", err)
    throw err
  }
}

module.exports = connectDB
