const express = require('express');
const morgan = require('morgan');

const ErrorHandler = require('./utils/errorHandler');
const errorController = require('./controllers/error.controller');

const tourRouter = require('./routes/tours.routes');
const userRouter = require('./routes/user.routes');
const authRouter = require('./routes/auth.routes');

const app = express();

// Middlewares - modifies incoming request
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// ROUTES
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/auth', authRouter);

app.all('*', (req, res, next) => {
  next(new ErrorHandler(`Can't find ${req.originalUrl}`, 404));
});

app.use(errorController);

// START SERVER
module.exports = app;
