import express from "express";
import controller from "../Controllers/productType.js";
import multer from "multer";

const Router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

Router.get("/", controller.get);
Router.get("/:id", controller.getId);
Router.post("/", upload.single("file"), controller.post);
Router.put("/", upload.single("file"), controller.put);
Router.delete("/:id", controller.remove);

export default Router;
