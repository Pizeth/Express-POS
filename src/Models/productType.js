// Models/category.js
import prisma from "../Configs/connect.js";
import upload from "../Services/fileUpload.js";
import product from "./product.js";

export const get = async (req) => {
  try {
    const result = await prisma.productType.findMany({
      include: {
        products: true,
      },
    });
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getId = async (req) => {
  try {
    const id = Number(req.params.id);
    const result = await prisma.productType.findUnique({
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
  let fileName = "";
  let image = "";
  try {
    const { name, createdBy, lastUpdatedBy, objectVersionId } = req.body;

    // First upload the file and wait for the response
    const uploadResponse = await upload.uploadFile(req, res, name);
    const image = uploadResponse.url;
    if (image) {
      fileName = uploadResponse.fileName;
    }
    // if (uploadResponse.status == 200) {
    //   image = uploadResponse.url;
    //   fileName = uploadResponse.fileName;
    // }

    // Create productType in database
    const result = await prisma.productType.create({
      data: {
        name: name,
        image: image,
        createdBy: Number(createdBy),
        lastUpdatedBy: Number(lastUpdatedBy),
        objectVersionId: Number(objectVersionId),
      },
    });

    return result;
  } catch (error) {
    if (fileName) {
      try {
        const deleteResponse = await upload.deleteFile(fileName);
        console.log(`Rolled back uploaded file: ${deleteResponse.fileName}`);
      } catch (deleteError) {
        console.error("Error rolling back file:", deleteError);
      }
    }
    console.error("Error in post productType model:", error);
    throw error; // Re-throw to be caught by the controller
  }
};

export const put = async (req, res) => {
  let fileName = "";
  let imagePath = "";
  try {
    const { id, name, image, createdBy, lastUpdatedBy, objectVersionId } =
      req.body;

    // First upload the file and wait for the response
    const uploadResponse = await upload.uploadFile(req, res, name);
    imagePath = uploadResponse.url;
    if (imagePath) {
      fileName = uploadResponse.fileName;
    } else {
      imagePath = image;
    }

    // if (uploadResponse.status == 200) {
    //   imagePath = uploadResponse.url;
    // }

    // Update productType in database
    const result = await prisma.productType.update({
      where: {
        id: Number(id),
      },
      data: {
        name: name,
        image: imagePath,
        createdBy: Number(createdBy),
        lastUpdatedBy: Number(lastUpdatedBy),
        objectVersionId: Number(objectVersionId),
      },
    });

    return result;
  } catch (error) {
    if (fileName) {
      try {
        const deleteResponse = await upload.deleteFile(fileName);
        console.log(`Rolled back uploaded file: ${deleteResponse.fileName}`);
      } catch (deleteError) {
        console.error("Error rolling back file:", deleteError);
      }
    }
    console.error("Error in put productType model:", error);
    throw error;
  }
};

export const remove = async (req) => {
  try {
    const id = Number(req.params.id);
    const result = await prisma.productType.delete({
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
