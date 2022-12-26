require('dotenv').config();
const app = require('./index');
const mongoose = require('mongoose');
const { handleUncaughtExceptions } = require('./utils/errorHandler');

const DB = process.env.MONG0_URI.replace('<PASSWORD>', process.env.DB_PASSWORD);
const port = process.env.PORT || 4000;

const connectDb = async (cb) => {
  handleUncaughtExceptions();
  try {
    await mongoose.connect(DB);
    console.log('database connected');
    cb();
  } catch (error) {
    console.log('Error connecting to database');
  }
};

connectDb(() => {
  app.listen(port, (err) => {
    if (err) {
      console.log('Error in starting server');
      process.exit(1);
    }
    console.log(`App running on port ${port}`);
  });
});
