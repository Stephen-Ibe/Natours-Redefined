const User = require('../models/user.model');
const { getAllUsers } = require('../service/user.service');
const ErrorHandler = require('../utils/errorHandler');
const { catchAsync } = require('../utils/errorHandler');

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await getAllUsers();

  if (!users) {
    return next(new ErrorHandler('An error occured', 400));
  }

  res.status(200).json({
    data: {
      users,
    },
    message: 'Users fetched successfully',
    status: 'success',
  });
});

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Invalid Route',
  });
};

exports.getOneUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Invalid Route',
  });
};

exports.updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Invalid Route',
  });
};

exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Invalid Route',
  });
};
