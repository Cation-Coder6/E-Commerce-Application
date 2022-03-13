const Review = require("../models/Review");
const Product = require("../models/Product");

const CustomError = require("../errors");
const { StatusCodes } = require("http-status-codes");
const { checkPermissions } = require("../utils");

//creating a review by a user for a particular product

const createReview = async (req, res) => {
  //we extract the product from request to check if the id of the product is valid

  const { product: productId } = req.body;
  const isValidProduct = await Product.findOne({ _id: productId });
  if (!isValidProduct) {
    throw new CustomError.NotFoundError(`No Product with id:${productId}`);
  }

  //we check if the current user for the current product already has a review in the database and throw error if there is

  const alreadySubmitted = await Review.findOne({
    product: productId,
    user: req.user.userId,
  });
  if (alreadySubmitted) {
    throw new CustomError.BadRequestError(
      "Review for this product by current user already exists"
    );
  }

  //rest is normal once product id is verified

  req.body.user = req.user.userId;
  const review = await Review.create(req.body);
  res.status(StatusCodes.OK).json({ review });
};

//get all reviews throughout database
const getAllReviews = async (req, res) => {
  const reviews = await Review.find({}).populate({
    path: "product",
    select: "name , company , price",
  });

  res.status(StatusCodes.OK).json({ reviews, count: reviews.length });
};

//get a single review using id
const getSingleReview = async (req, res) => {
  const { id: reviewId } = req.params;
  const review = await Review.findOne({ _id: reviewId });
  if (!review) {
    throw new CustomError.NotFoundError(`No Review with id: ${reviewId} `);
  }
  res.status(StatusCodes.OK).json({ review });
};

//update a single review using id
const updateReview = async (req, res) => {
  const { id: reviewId } = req.params;
  const { rating, title, comment } = req.body;

  const review = await Review.findOne({ _id: reviewId });
  if (!review) {
    throw new CustomError.NotFoundError(`No Review with id: ${reviewId}`);
  }
  checkPermissions(req.user, review.user);
  review.rating = rating;
  review.title = title;
  review.comment = comment;

  await review.save();
  res.status(StatusCodes.OK).json({ review });
};

//delete a single review using id
const deleteReview = async (req, res) => {
  const { id: reviewId } = req.params;
  const review = await Review.findOne({ _id: reviewId });
  if (!review) {
    throw new CustomError.NotFoundError(`No review with id: ${reviewId}`);
  }
  //to allow only admins and the person who made the review to delete reviews
  checkPermissions(req.user, review.user);
  await review.remove();
  res
    .status(StatusCodes.OK)
    .json({ msg: "Success! Review Deleted Successfully." });
};

const getSingleProductReviews = async (req, res) => {
  const { id: productId } = req.params;
  const reviews = await Review.find({ product: productId });
  res.status(StatusCodes.OK).json({ reviews, count: reviews.length });
};

module.exports = {
  createReview,
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview,
  getSingleProductReviews,
};
