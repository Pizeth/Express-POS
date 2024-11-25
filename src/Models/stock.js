import prisma from "../Configs/connect.js";
import qr from "../Configs/qrCode.js";
import upload from "./fileUpload.js";
import { getMaxPage } from "../Helpers/function.js";

export const get = async (req) => {
  try {
    const result = await prisma.stock.findMany({});
    return result;
  } catch (error) {
    throw error;
  }
};

export const getId = async (req) => {
  try {
    const id = Number(req.params.id);
    const result = await prisma.product.findUnique({
      where: {
        id: id,
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
      productId,
      quantity,
      importedDate,
      expiredDate,
      price,
      salePrice,
      createdBy,
      lastUpdatedBy,
      objectVersionId,
    } = req.body;

    // First upload the file and wait for the response
    // const uploadResponse = await upload.uploadFile(req, res, name);
    // const image = uploadResponse.url;
    // if (image) {
    //   fileName = uploadResponse.fileName;
    // }
    const metadata = {
      productId: productId,
      expiredDate: expiredDate,
    };
    const qrCode = qr.getQrCode(metadata);
    console.log(qrCode);

    // Create product in database
    const result = await prisma.product.create({
      data: {
        productId: Number(productId),
        quantity: Number(quantity),
        importedDate: new Date(importedDate),
        expiredDate: new Date(expiredDate),
        price: Number(price),
        salePrice: Number(salePrice),
        qrCode: qrCode,
        createdBy: Number(createdBy),
        lastUpdatedBy: Number(lastUpdatedBy),
        objectVersionId: Number(objectVersionId),
      },
    });

    return result;
  } catch (error) {
    // if (fileName) {
    //   try {
    //     const deleteResponse = await upload.deleteFile(fileName);
    //     console.log(`Rolled back uploaded file: ${deleteResponse.fileName}`);
    //   } catch (deleteError) {
    //     console.error("Error rolling back file:", deleteError);
    //   }
    // }
    console.error("Error in post stock model:", error);
    throw error; // Re-throw to be caught by the controller
  }
};

export const put = async (req, res) => {
  let fileName = "";
  let imagePath = "";
  try {
    const {
      id,
      subCategoryId,
      manufacturerId,
      productTypeId,
      productCode,
      name,
      shortName,
      description,
      longDescription,
      barCode,
      quantity,
      referenceNumber,
      price,
      salePrice,
      image,
      createdBy,
      lastUpdatedBy,
      objectVersionId,
    } = req.body;

    // First upload the file and wait for the response
    const uploadResponse = await upload.uploadFile(req, res, name);
    imagePath = uploadResponse.url;
    if (imagePath) {
      console.log(`Image url: ${imagePath}`);
      fileName = uploadResponse.fileName;
    } else {
      imagePath = image;
    }

    // Update product in database
    const result = await prisma.product.update({
      where: {
        id: Number(id),
      },
      data: {
        subCategoryId: Number(subCategoryId),
        manufacturerId: Number(manufacturerId),
        productTypeId: Number(productTypeId),
        productCode: productCode,
        name: name,
        shortName: shortName,
        description: description,
        longDescription: longDescription,
        barCode: barCode,
        quantity: Number(quantity),
        referenceNumber: referenceNumber,
        price: Number(price),
        salePrice: salePrice,
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
    const result = await prisma.product.delete({
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
