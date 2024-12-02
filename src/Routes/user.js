// const express = require("express");
// const controller = require("../Controllers/user");

// const Router = express();

// Router.post("/register", controller.registerUser);
// Router.post("/login", controller.loginUser);

// module.exports = Router;

import express from "express";
import controller from "../Controllers/user.js";
import multer from "multer";

const Router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Router.get("/", categoryController.getCategories);

Router.get("/username/:username", controller.getUsername);
Router.get("/email/:email", controller.getEmail);
Router.get("/", controller.getUser);
Router.get("/:id", controller.getUserId);
Router.post("/register", upload.single("file"), controller.registerUser);
Router.post("/login", controller.loginUser);
// Router.post("/logout", controller.logoutUser);
Router.put("/", upload.single("file"), controller.putUser);
Router.delete("/:id", controller.deleteUser);

export default Router;
