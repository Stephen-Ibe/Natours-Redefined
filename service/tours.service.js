const Tour = require('../models/tourModel');
const ErrorHandler = require('../utils/errorHandler');

exports.createNewTour = async (data) => {
  try {
    const newTour = await Tour.create(data);
    return newTour;
  } catch (err) {
    throw err;
  }
};

exports.getOneTour = async (data) => {
  try {
    const tour = await Tour.findById(data);

    return tour;
  } catch (err) {
    throw err;
  }
};

exports.updateOneTour = async (data) => {
  try {
    const tour = await Tour.findByIdAndUpdate(data.params.id, data.body, {
      new: true,
      runValidators: true,
    });
    return tour;
  } catch (err) {
    throw err;
  }
};
