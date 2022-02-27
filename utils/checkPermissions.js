const CustomError = require("../errors");

const chechPermissions = (requestUser, resourceUserId) => {
  if (requestUser.role === "admin") return;
  if (requestUser.userId === resourceUserId) return;

  throw new CustomError.UnauthorizedError(
    "This User Does not have the necessary Roles to access this route"
  );
};

module.exports = chechPermissions;
