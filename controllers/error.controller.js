const ErrorHandler = require('../utils/errorHandler');

const sendDevError = (err, res) => {
  res.status(err.statusCode).json({
    message: err.message,
    status: err.status,
    error: err,
    stack: err.stack,
  });
};

const sendProdError = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      message: err.message,
      status: err.status,
    });
  } else {
    res.status(500).json({
      status: 'failed',
      message: 'Something went wrong',
      error: err,
    });
  }
};

const handleCastError = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new ErrorHandler(message, 400);
};

const handleDuplicateFieldError = (err) => {
  const message = `Duplicate field value "${err.keyValue.name}. Please use another value`;
  return new ErrorHandler(message, 400);
};

const handleValidationError = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);

  const message = `Invalid input data. ${errors.join('. ')}`;
  return new ErrorHandler(message, 400);
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendDevError(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };

    if (err.name === 'CastError') error = handleCastError(error);
    if (err.code === 11000) error = handleDuplicateFieldError(error);
    if (err.name === 'ValidationError') error = handleValidationError(error);

    sendProdError(error, res);
  }
};
