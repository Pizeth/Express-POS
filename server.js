// require ('dotenv/config');

// const express = require ('express');
// const logger = require ('morgan');
// const bodyParser = require ('body-parser');
// const cors = require('cors')

// const corsOptions ={
//     origin:['http://localhost:3000', 'http://pharmacy-ui.test'],
//     methods:['POST', 'GET', 'PUT', 'UPDATE'],
//     credentials:true,            //access-control-allow-credentials:true
//     optionSuccessStatus:200
// }

// const Router = require ('./src/Routes/index');
// const server = express();
// const port = process.env.PORT || 3030;
// const nodeEnv = 'Development';

// server.listen(port, () => {
//   console.log(`Server is running in port ${port} in ${nodeEnv} Mode`);
// });

// server.use(logger('dev'));
// server.use(bodyParser.json());
// server.use(bodyParser.urlencoded({extended: false}));
// // server.use(cors(corsOptions))
// server.use(cors);

// server.use('/', Router);

// module.exports = server;

// server.js
import { config } from "dotenv";
import express from "express";
import logger from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { ErrorHandler } from "./src/Utils/responseHandler.js";
import Router from "./src/Routes/index.js"; // Note: .js extension is required for ES modules

// Initialize environment variables
config();

// const corsOptions = {
//   origin: ["http://localhost:3000", "http://pharmacy-ui.test"],
//   methods: ["POST", "GET", "PUT", "UPDATE"],
//   credentials: true,
//   optionSuccessStatus: 200,
// };

const server = express();
const port = process.env.PORT || 3030;
const nodeEnv = process.env.NODE_ENV;

// Middleware
server.use(logger("dev"));
server.use(cookieParser());
server.use(express.json());
// server.use(bodyParser.json());
// server.use(bodyParser.urlencoded({ extended: false }));

server.use(helmet()); // Adds security headers
server.use(
  cors({
    origin:
      process.env.CORS_ORIGIN ||
      "http://localhost:3030" ||
      "http://pharmacy-ui.test",
    methods: ["POST", "GET", "PUT", "PATCH", "DELETE", "HEAD"],
    credentials: true,
    optionSuccessStatus: 200,
  })
);

// Global rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limit each IP to 1000 requests per windowMs
  message: "Too many requests, please try again later",
});

server.use(limiter);

// If you want to use cors with options:
// server.use(cors(corsOptions));
// Or if you want to use default cors:
// server.use(cors());

// Routes
server.use("/", Router);
// server.use('/api/auth', authRoutes);

// Error handling middleware
// server.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).json({
//     message: "Something went wrong!",
//     error: process.env.NODE_ENV === "production" ? {} : err.stack,
//   });
// });

// Global error handling middleware
server.use((err, req, res, next) => {
  ErrorHandler.handle(err.message, err, req, res, next);
});

// 404 handler
server.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

server.listen(port, () => {
  console.log(`Server is running in port ${port} in ${nodeEnv} Mode`);
});

export default server;
