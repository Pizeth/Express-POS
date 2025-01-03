// Models/category.js
import prisma from "../Configs/connect.js";
import upload from "../Services/fileUpload.js";

export const get = async (req) => {
  try {
    const result = await prisma.subCategory.findMany({
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
    const result = await prisma.subCategory.findUnique({
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
    const {
      categoryId,
      shortName,
      name,
      description,
      createdBy,
      lastUpdatedBy,
      objectVersionId,
    } = req.body;

    // First upload the file and wait for the response
    const uploadResponse = await upload.uploadFile(req, res, shortName);
    let image = "";
    if (uploadResponse.status == 200) {
      image = uploadResponse.url;
    }

    // Create subCategory in database
    const result = await prisma.subCategory.create({
      data: {
        categoryId: Number(categoryId),
        shortName: shortName,
        name: name,
        description: description,
        image: image,
        createdBy: Number(createdBy),
        lastUpdatedBy: Number(lastUpdatedBy),
        objectVersionId: Number(objectVersionId),
      },
    });

    return result;
  } catch (error) {
    console.error("Error in post subCategory model:", error);
    throw error; // Re-throw to be caught by the controller
  }
};

export const put = async (req, res) => {
  try {
    const {
      id,
      categoryId,
      shortName,
      name,
      description,
      image,
      createdBy,
      lastUpdatedBy,
      objectVersionId,
    } = req.body;

    // First upload the file and wait for the response
    const uploadResponse = await upload.uploadFile(req, res, shortName);
    let imagePath = image;
    if (uploadResponse.status == 200) {
      imagePath = uploadResponse.url;
    }

    // Update subCategory in database
    const result = await prisma.subCategory.update({
      where: {
        id: Number(id),
      },
      data: {
        categoryId: Number(categoryId),
        shortName: shortName,
        name: name,
        description: description,
        image: imagePath,
        createdBy: Number(createdBy),
        lastUpdatedBy: Number(lastUpdatedBy),
        objectVersionId: Number(objectVersionId),
      },
    });

    return result;
  } catch (error) {
    console.error("Error in put subCategory model:", error);
    throw error;
  }
};

export const remove = async (req) => {
  try {
    const id = Number(req.params.id);
    const result = await prisma.subCategory.delete({
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
