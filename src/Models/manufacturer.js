// Models/category.js
import prisma from "../Configs/connect.js";
import upload from "../Services/fileUpload.js";
import { getMaxPage } from "../Helpers/function.js";

export const get = async (req) => {
  try {
    const result = await prisma.manufacturer.findMany({
      include: {
        products: true,
      },
    });
    return result;
  } catch (error) {
    throw error;
  }
};

export const getId = async (req) => {
  try {
    const id = Number(req.params.id);
    const result = await prisma.manufacturer.findUnique({
      where: {
        id: id,
      },
      include: {
        products: true,
      },
    });
    return result;
  } catch (error) {
    throw error;
  }
};

export const post = async (req, res) => {
  try {
    const { name, phone, createdBy, lastUpdatedBy, objectVersionId } = req.body;

    // First upload the file and wait for the response
    const uploadResponse = await upload.uploadFile(req, res, name);
    let image = "";
    if (uploadResponse.status == 200) {
      image = uploadResponse.url;
    }

    // Create manufacturer in database
    const result = await prisma.manufacturer.create({
      data: {
        name: name,
        phone: phone,
        image: image,
        createdBy: Number(createdBy),
        lastUpdatedBy: Number(lastUpdatedBy),
        objectVersionId: Number(objectVersionId),
      },
    });

    return result;
  } catch (error) {
    console.error("Error in post manufacturer model:", error);
    throw error; // Re-throw to be caught by the controller
  }
};

export const put = async (req, res) => {
  try {
    const {
      id,
      name,
      phone,
      image,
      createdBy,
      lastUpdatedBy,
      objectVersionId,
    } = req.body;

    // First upload the file and wait for the response
    const uploadResponse = await upload.uploadFile(req, res, name);
    let imagePath = image;
    if (uploadResponse.status == 200) {
      imagePath = uploadResponse.url;
    }

    // Update manufacturer in database
    const result = await prisma.manufacturer.update({
      where: {
        id: Number(id),
      },
      data: {
        name: name,
        phone: phone,
        image: imagePath,
        createdBy: Number(createdBy),
        lastUpdatedBy: Number(lastUpdatedBy),
        objectVersionId: Number(objectVersionId),
      },
    });

    return result;
  } catch (error) {
    console.error("Error in put manufacturer model:", error);
    throw error;
  }
};

export const remove = async (req) => {
  try {
    const id = Number(req.params.id);
    const result = await prisma.manufacturer.delete({
      where: {
        id: Number(id),
      },
    });
    return result;
  } catch (error) {
    throw error;
  }
};

export default {
  get,
  getId,
  post,
  put,
  remove,
};
