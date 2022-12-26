const ErrorHandler = require('../utils/errorHandler');
const { catchAsync } = require('../utils/errorHandler');

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

  next();
});
