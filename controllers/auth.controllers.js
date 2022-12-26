const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const { createNewUser, signin } = require('../service/auth.service');
const { catchAsync } = require('../utils/errorHandler');
const ErrorHandler = require('../utils/errorHandler');

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await createNewUser(req.body);

  const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  res.status(201).json({
    status: 'success',
    data: {
      user: newUser,
      token,
    },
    message: 'User created successfully',
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { user, checkIfPasswordMatch } = await signin(req.body);
  console.log(checkIfPasswordMatch);

  if (!user || !checkIfPasswordMatch) {
    return next(new ErrorHandler('Invalid email or password'), 401);
  }

  const token = '';

  res.status(200).json({
    status: 'success',
    token,
    message: 'User Authenticated Successfully',
  });
});
