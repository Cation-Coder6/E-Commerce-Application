const getAllUsers = async (req, res) => {
  res.send("Get all users route");
};

const getSingleUser = async (req, res) => {
  res.send("Get single user route");
};

const showCurrentUser = async (req, res) => {
  res.send("Get current user route");
};

const updateUser = async (req, res) => {
  res.send("Update route");
};

const updateUserPassword = async (req, res) => {
  res.send("Update Password route");
};

module.exports = {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
};
