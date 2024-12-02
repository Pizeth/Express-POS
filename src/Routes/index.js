// const express = require('express');
// const product = require ('./product');
// const category = require ('./category');
// const order = require ('./order');
// const user = require("./user");
// const jwt = require("jsonwebtoken");
// const form = require('../Helpers/form')
// const secretKey = process.env.SECRET_KEY || 270400;

// const Router = express.Router();

// const validateUser = (req, res, next) => {
//     jwt.verify(req.headers['x-access-token'], secretKey, (err, decoded) => {
//       if (err) {
//         form.error(res, err.message);
//       }else{
//         req.body.user_id = decoded.id;
//         next();
//       }
//     });
//   }

// Router.get('/', (req, res) => {
//     res.json({
//         message: "Welcome to RESTfull API for Point of Sale",
//         author: "@Razeth",
//         documentation: "https://github.com/Pizeth/Express-POS",
//         github: "github.com/Pizeth"
//     });
// })

// Router.use('/product',validateUser, product);
// Router.use('/category',validateUser, category);
// Router.use('/order',validateUser, order);
// Router.use('/user', user)

// module.exports = Router;

// Router/index.js
import express from "express";
import jwt from "jsonwebtoken";
import categoryRoutes from "./category.js";
import subCategory from "./subCategory.js";
import manufacturer from "./manufacturer.js";
import productType from "./productType.js";
import productRoutes from "./product.js";
import stockRoutes from "./stock.js";
// import orderRoutes from "./order.js";
import profileRoutes from "./profile.js";
import userRoutes from "./user.js";
import uploadRoutes from "./fileUpload.js";
import { error } from "../Helpers/form.js";

const secretKey = process.env.SECRET_KEY || 270400;
const Router = express.Router();

const validateUser = (req, res, next) => {
  jwt.verify(req.headers["x-access-token"], secretKey, (err, decoded) => {
    if (err) {
      error(res, err.message);
    } else {
      req.body.user_id = decoded.id;
      next();
    }
  });
};

Router.get("/", (req, res) => {
  res.json({
    message: "Welcome to RESTfull API for Point of Sale",
    author: "@Razeth",
    documentation: "https://github.com/Pizeth/Express-POS",
    github: "github.com/Pizeth",
  });
});

// Routes with middleware
Router.use("/category", validateUser, categoryRoutes);
Router.use("/subCategory", validateUser, subCategory);
Router.use("/manufacturer", validateUser, manufacturer);
Router.use("/productType", validateUser, productType);
Router.use("/product", validateUser, productRoutes);
Router.use("/stock", validateUser, stockRoutes);
// Router.use("/order", validateUser, orderRoutes);
Router.use("/profile", validateUser, profileRoutes);
Router.use("/user", userRoutes);
Router.use("/upload", uploadRoutes);

export default Router;
