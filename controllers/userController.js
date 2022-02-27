const User = require("../models/user");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const {
  attachCookiesToResponse,
  createTokenUser,
  checkPermissions,
} = require("../utils");

//getting all users
const getAllUsers = async (req, res) => {
  console.log(req.user);
  const users = await User.find({ role: "user" }).select("-password");

  if (!users) {
    throw new CustomError.NotFoundError("NO USERS FOUND WITH ROLE:USER");
  }
  res.status(StatusCodes.OK).json({ users, count: users.length });
};

//getting a single user from a given id in the params
const getSingleUser = async (req, res) => {
  const user = await User.find({ _id: req.params.id }).select("-password");

  if (!user) {
    throw new CustomError.NotFoundError(
      `NO USER FOUND WITH THE GIVEN ID $(req.params.id)`
    );
  }
  checkPermissions(req.user, req.params.id);
  res.status(StatusCodes.OK).json({ user });
};

// shows the current user from the req payload
const showCurrentUser = async (req, res) => {
  res.status(StatusCodes.OK).json({ user: req.user });
};

//updating user password after verifying it
const updateUserPassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    throw new CustomError.BadRequestError(
      "Please Provide the new and old password"
    );
  }
  const user = await User.findOne({ _id: req.user.userId });

  const isPasswordCorrect = await user.comparePassword(oldPassword);
  if (!isPasswordCorrect) {
    throw new CustomError.UnauthenticatedError("Invalid Password");
  }
  user.password = newPassword;

  await user.save();
  res.status(StatusCodes.OK).json({ msg: "Success! Password Updated" });
};

//updating a user using user.save()
const updateUser = async (req, res) => {
  const { email, name } = req.body;
  if (!email || !name) {
    throw new CustomError.BadRequestError(
      "Please Provide all the given values"
    );
  }
  const user = await User.findOne({ _id: req.user.userId });

  user.email = email;
  user.name = name;

  await user.save();

  const tokenUser = createTokenUser(user);
  attachCookiesToResponse({ res, user: tokenUser });
  res.status(StatusCodes.OK).json({ user: tokenUser });
};

module.exports = {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
};

// updating user with FindOneAndUpdate function from mongoose
// const updateUser = async (req, res) => {
//   const { email, name } = req.body;
//   if (!email || !name) {
//     throw new CustomError.BadRequestError(
//       "Please Provide all the given values"
//     );
//   }
//   const user = await User.findOneAndUpdate(
//     { _id: req.user.userId },
//     { email, name },
//     { new: true, runValidators: true }
//   );
//   const tokenUser = createTokenUser(user);
//   attachCookiesToResponse({ res, user: tokenUser });
//   res.status(StatusCodes.OK).json({ user: tokenUser });
// };
