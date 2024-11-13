// const express = require("express");
// const controller = require("../Controllers/category");

// const Router = express.Router();

// Router.get("/", controller.getCategories);
// // Router.get("/", controller.getCategory);
// Router.get("/:id", controller.getCategoryId);
// Router.post("/", controller.postCategory);
// Router.put("/", controller.putCategory);
// Router.delete("/:id", controller.deleteCategory);

// module.exports = Router;

// Routes/category.js
import express from "express";
import controller from "../Controllers/category.js";

const Router = express.Router();

// Router.get("/", categoryController.getCategories);
Router.get("/", controller.getCategory);
Router.get("/:id", controller.getCategoryId);
Router.post("/", controller.postCategory);
Router.put("/", controller.putCategory);
Router.delete("/:id", controller.deleteCategory);

export default Router;
