const mongoose = require('mongoose');

const connectDB = async () => {
  console.log(process.env.DB_CONNECTION_SECRET);
  await mongoose.connect(
    'mongodb+srv://heyshubhampatel2005_db_user:nttPgTGKe0dO0fF9@cluster0.od1rngk.mongodb.net/devTinderDB?retryWrites=true&w=majority'
  );
};

module.exports = connectDB;
