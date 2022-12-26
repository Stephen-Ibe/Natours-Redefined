class ErrorHandler extends Error {
  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'failed' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }

  static catchAsync = (fn) => {
    return (req, res, next) => {
      fn(req, res, next).catch(next);
    };
  };

  static handleUncaughtExceptions = () => {
    process.on('uncaughtException', (err) => {
      process.exit(1);
    });
  };
}

module.exports = ErrorHandler;
