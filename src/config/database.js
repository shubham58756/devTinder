const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    console.log("Connecting to DB...");
    await mongoose.connect(
      'mongodb+srv://heyshubhampatel2005_db_user:coSvuwmBMssa2Hcc@cluster0.od1rngk.mongodb.net/devTinderDB?retryWrites=true&w=majority'
  );
    
    console.log("Database connection established.");
  } catch (err) {
    console.error("Database cannot be connected!!", err);
    process.exit(1); // Optional: stop the server if DB fails
  }
};

module.exports = connectDB;


