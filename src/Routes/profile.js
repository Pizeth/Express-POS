import express from "express";
import controller from "../Controllers/profile.js";

const Router = express.Router();

Router.get("/", controller.get);
Router.get("/:id", controller.getId);
Router.post("/", controller.post);
Router.put("/", controller.put);
Router.delete("/:id", controller.remove);

export default Router;
