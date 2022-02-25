const express = require("express");
const routes = express.Router();

const { register, login, logout } = require("../controllers/authController");

routes.post("/register", register);
routes.post("/login", login);
routes.get("/logout", logout);

module.exports = routes;
