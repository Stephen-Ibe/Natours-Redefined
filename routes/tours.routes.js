const express = require('express');
const {
  getAllTours,
  createNewTour,
  getOneTour,
  updateOneTour,
  deleteTour,
  aliasTopTours,
  getTourStats,
  getMonthlyPlan,
} = require('../controllers/tours.controllers');
const { isProtected } = require('../middlewares/protected');

const router = express.Router();

router.route('/top-5-cheap').get(aliasTopTours, getAllTours);
router.route('/tour-stats').get(getTourStats);
router.route('/monthly-plan/:year').get(getMonthlyPlan);

router.route('/').get(isProtected, getAllTours).post(createNewTour);
router.route('/:id').get(getOneTour).patch(updateOneTour).delete(deleteTour);

module.exports = router;
