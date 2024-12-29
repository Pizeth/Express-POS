import express from "express";
import controller from "../Controllers/validation.js";

const Router = express.Router();

Router.get("/username/:username", controller.getUsername);
Router.get("/email/:email", controller.getEmail);

export default Router;
