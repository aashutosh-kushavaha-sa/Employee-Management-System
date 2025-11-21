const express = require('express');
const routes = express.Router();

const {createAdmin , loginAdmin} = require("../controllers/adminController");

routes.post("/signUp" , createAdmin);
routes.post("/login" , loginAdmin);

module.exports = routes;