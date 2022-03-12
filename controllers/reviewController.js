const createReview = async (req, res) => {
  res.send("Create Review Function Called.");
};
const getAllReviews = async (req, res) => {
  res.send("Get All Reviews Function Called.");
};
const getSingleReview = async (req, res) => {
  res.send("Get Single Review Function Called.");
};
const updateReview = async (req, res) => {
  res.send("Update Review Function Called.");
};
const deleteReview = async (req, res) => {
  res.send("Delete Review Function Called.");
};

module.exports = {
  createReview,
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview,
};
