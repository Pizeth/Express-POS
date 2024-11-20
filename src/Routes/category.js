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
import multer from "multer";

const Router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Router.get("/", categoryController.getCategories);
Router.get("/", controller.get);
Router.get("/:id", controller.getId);
Router.post("/", upload.single("file"), controller.post);
Router.put("/", upload.single("file"), controller.put);
Router.delete("/:id", controller.remove);

export default Router;
