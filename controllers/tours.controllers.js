const Tour = require('../models/tourModel');
const {
  getOneTour,
  createNewTour,
  updateOneTour,
} = require('../service/tours.service');
const APIFeatures = require('../utils/apiFeatures');
const ErrorHandler = require('../utils/errorHandler');
const { catchAsync } = require('../utils/errorHandler');

// read file that contains data
// const fs = require('fs)
// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../data/tours-simple.json`)
// );

exports.aliasTopTours = async (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';

  next();
};

exports.getAllTours = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const tours = await features.query;

  res.status(200).json({
    message: 'Tours fetched successfully',
    results: tours.length,
    status: 'success',
    data: { tours },
  });
});

exports.getOneTour = catchAsync(async (req, res, next) => {
  const tour = await getOneTour(req.params.id);

  if (!tour) {
    return next(new ErrorHandler('Tour not found', 404));
  }

  res.status(200).json({
    message: 'Tour fetched successfully',
    data: { tour },
    status: 'success',
  });
});

exports.createNewTour = catchAsync(async (req, res, next) => {
  const newTour = await createNewTour(req.body);
  res.status(201).json({
    message: 'Tour created Successfully',
    data: { tour: newTour },
    status: 'success',
  });
});

exports.updateOneTour = catchAsync(async (req, res, next) => {
  const tour = await updateOneTour(req);

  if (!tour) {
    return next(new ErrorHandler('Tour not found', 404));
  }

  res.status(200).json({
    message: 'Update successful',
    data: {
      tour,
    },
    status: 'success',
  });
});

exports.deleteTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndDelete(req.params.id);

  if (!tour) {
    return next(new ErrorHandler('Tour not found', 404));
  }

  res.status(204).json({
    data: null,
    status: 'success',
  });
});

exports.getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    { $match: { ratingsAverage: { $gte: 4.5 } } },
    {
      $group: {
        _id: { $toUpper: '$difficulty' },
        numTours: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $avg: '$price' },
        maxPrice: { $avg: '$price' },
      },
    },
    { $sort: { avgPrice: 1 } },
  ]);

  res.status(200).json({ status: 'success', data: { stats } });
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1;
  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numTourStarts: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },
    {
      $addFields: { month: '$_id' },
    },
    {
      $project: {
        _id: 0,
      },
    },
    {
      $sort: { numaTourStarts: -1 },
    },
    {
      $limit: 12,
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      plan,
    },
  });
});
