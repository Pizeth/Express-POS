// const express = require("express");
// const controller = require("../Controllers/user");

// const Router = express();

// Router.post("/register", controller.registerUser);
// Router.post("/login", controller.loginUser);

// module.exports = Router;

import express from "express";
import controller from "../Controllers/user.js";

const Router = express.Router();

// Router.get("/", categoryController.getCategories);

Router.get("/", controller.getUser);
Router.get("/:id", controller.getUserId);
Router.post("/register", controller.registerUser);
Router.post("/login", controller.loginUser);
// Router.post("/logout", controller.logoutUser);
Router.put("/", controller.putUser);
Router.delete("/:id", controller.deleteUser);

export default Router;
