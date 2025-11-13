const express = require('express');
const routes = express.Router();

const {createUser , loginUser} = require("../controllers/userController");

routes.post("/signUp" , createUser);
routes.post("/login" , loginUser);

module.exports = routes;