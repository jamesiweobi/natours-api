const Tour = require('../models/tourModel');
const APIfeatures = require('../utils/apiFeatures');

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingAverage,-price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

exports.getAllTours = async (req, res) => {
  try {
    const features = new APIfeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    // Execute Query
    const tours = await features.query;

    // Send response
    return res.status(200).json({
      status: 'success',
      result: tours.length,
      data: {
        tours,
      },
    });
  } catch (error) {
    return res.status(404).json({
      status: 'fail',
      message: error,
    });
  }
};

exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    return res.status(200).json({
      status: 'success',
      result: tour.length,
      data: {
        tour: tour,
      },
    });
  } catch (error) {
    return res.status(401).json({
      status: 'fail',
      message: error,
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    return res.status(200).json({
      status: 'success',
      result: tour.length,
      data: {
        tour,
      },
    });
  } catch (error) {
    return res.status(401).json({
      status: 'fail',
      message: error,
    });
  }
};

exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);
    return res.status(201).json({
      status: 'success',
      result: newTour.length,
      data: {
        tour: newTour,
      },
    });
  } catch (error) {
    return res.status(400).json({
      status: 'fail',
      message: error,
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    await Tour.fineByIdAndDelete(req.params.id);
    return res.status(204).json({
      status: 'success',
      data: {
        tour: null,
      },
    });
  } catch (error) {
    return res.status(400).json({
      status: 'fail',
      message: error,
    });
  }
  b;
};

exports.getTourStats = async (req, res) => {
  try {
    console.log('hre');
    const stats = await Tour.aggregate([
      {
        $match: { price: { $gte: 300 } },
      },
      {
        $group: {
          _id: { $toUpper: '$difficulty' },
          numTours: { $sum: 1 },
          numRatings: { $sum: '$ratingsQuantity' },
          avgRating: { $avg: '$ratingsAverage' },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
        },
      },
      {
        $sort: {
          avgPrice: 1,
        },
      },
      // {
      //   $match: { _id: { $ne: 'EASY' } },
      // },
    ]);
    return res.status(200).json({
      status: 'success',
      result: stats.length,
      data: {
        stats,
      },
    });
  } catch (error) {
    return res.status(400).json({
      status: 'fail',
      message: error,
    });
  }
};

exports.getMonthlyPlan = async (req, res) => {
  try {
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
    ]);
    return res.status(200).json({
      status: 'success',
      result: plan.length,
      data: {
        plan,
      },
    });
  } catch (error) {
    return res.status(400).json({
      status: 'fail',
      message: error,
    });
  }
};
