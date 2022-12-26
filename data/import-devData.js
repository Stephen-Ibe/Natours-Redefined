require('dotenv').config();
const fs = require('fs');
const mongoose = require('mongoose');
const Tour = require('../models/tourModel');

const DB = process.env.MONG0_URI.replace('<PASSWORD>', process.env.DB_PASSWORD);

// .connect(process.env.DB_LOCAL){
mongoose
  .connect(DB)
  .then(() => console.log('DB Connection Successful'))
  .catch((err) => {
    console.log('Error connecting to database');
    process.exit(1);
  });

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8')
);

/**
 * Import data to database
 */
const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('Data successfully loaded');
  } catch (error) {
    console.log(error);
  }
  process.exit(1);
};

/**
 * Delete all data from database
 */
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log('Data successfully deleted');
  } catch (error) {
    console.log(error);
  }
  process.exit(1);
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
