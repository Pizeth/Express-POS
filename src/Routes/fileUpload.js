import express from "express";
import controller from "../Controllers/fileUpload.js";
import multer from "multer";

const Router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Router.get("/", categoryController.getCategories);

// Router.get("/", controller.getUser);
// Router.get("/:id", controller.getUserId);
Router.post("/", upload.single("file"), controller.uploadFile);
// Router.put("/", controller.putUser);
// Router.delete("/:id", controller.deleteUser);

export default Router;
