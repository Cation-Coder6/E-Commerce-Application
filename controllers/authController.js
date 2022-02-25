const User = require("../models/user");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const { attachCookiesToResponse } = require("../utils");

const register = async (req, res) => {
  const { email, password, name } = req.body;

  //checking for unique email alternative approach
  const emailExistance = await User.findOne({ email });
  if (emailExistance) {
    throw new CustomError.BadRequestError("This email already exists.");
  }

  //first registered user is an admin
  const isFirstAccount = (await User.countDocuments({})) === 0;
  const role = isFirstAccount ? "admin" : "user";

  //creating the user
  const user = await User.create({ name, password, email, role });

  //creating the jwt token
  const tokenUser = { name: user.name, userId: user._id, role: user.role };
  attachCookiesToResponse({ res, user: tokenUser });

  res.status(StatusCodes.CREATED).json({ user: tokenUser });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  //checking if both email and password is provided by the user
  if (!email || !password)
    throw new CustomError.BadRequest("Please provide both email and password");

  //check if user exists with given email
  const user = await User.findOne({ email });
  if (!user) throw new CustomError.UnauthenticatedError("Invalid Credentials");

  //check if the found user has the same password as given in the database
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect)
    throw new CustomError.UnauthenticatedError("Wrong Password Entered");

  //if we get the user with the given email and password then assign the token to cookies
  const token = { name: user.name, userId: user._id, role: user.role };
  attachCookiesToResponse({ res, user: token });

  //after assigning cookies display the payload
  res.status(StatusCodes.OK).json({ user: token });
};

const logout = async (req, res) => {
  res.cookie("token", "logout", {
    httpOnly: true,
    expiresIn: new Date(Date.now() + 0), //normally wait 5 * 1000 ms for browsers but for postman do it in 0 seconds
  });
  res.status(StatusCodes.OK).json("User Logged Out Successfully");
};

module.exports = {
  register,
  login,
  logout,
};
