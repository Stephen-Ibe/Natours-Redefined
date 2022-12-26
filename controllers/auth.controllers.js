const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const { createNewUser, signin } = require('../service/auth.service');
const { catchAsync } = require('../utils/errorHandler');
const ErrorHandler = require('../utils/errorHandler');

const signToken = (id) => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await createNewUser(req.body);

  const token = signToken(newUser._id);

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

  if (!user || !checkIfPasswordMatch) {
    return next(new ErrorHandler('Invalid email or password', 401));
  }

  const token = signToken(user.id);

  res.status(200).json({
    status: 'success',
    data: {
      user,
      accessToken: token,
    },
    message: 'User Authenticated Successfully',
  });
});
