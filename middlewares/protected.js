const { promisify } = require('util');
const ErrorHandler = require('../utils/errorHandler');
const { catchAsync } = require('../utils/errorHandler');
const jwt = require('jsonwebtoken');

exports.isProtected = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new ErrorHandler('Unauthorized! Please log in', 401));
  }

  const decodedToken = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET
  );
  console.log(decodedToken);

  next();
});
