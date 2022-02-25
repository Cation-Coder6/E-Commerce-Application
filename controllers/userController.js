const User = require("../models/user");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");

const getAllUsers = async (req, res) => {
  const users = await User.find({ role: "user" }).select("-password");

  if (!users) {
    throw new CustomError.NotFoundError("NO USERS FOUND WITH ROLE:USER");
  }
  res.status(StatusCodes.OK).json({ users, count: users.length });
};

const getSingleUser = async (req, res) => {
  const user = await User.find({ _id: req.params.id }).select("-password");

  if (!user) {
    throw new CustomError.NotFoundError(
      `NO USER FOUND WITH THE GIVEN ID $(req.params.id)`
    );
  }

  res.status(StatusCodes.OK).json({ user });
};

const showCurrentUser = async (req, res) => {
  res.send("Get current user route");
};

const updateUser = async (req, res) => {
  res.send(req.body);
};

const updateUserPassword = async (req, res) => {
  res.send(req.body);
};

module.exports = {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
};
