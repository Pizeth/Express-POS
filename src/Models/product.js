import prisma from "../Configs/connect.js";
import stock from "./stock.js";
import upload from "../Services/fileUpload.js";
import { getMaxPage } from "../Helpers/function.js";

export const get = async (req) => {
  try {
    const result = await prisma.product.findMany({
      include: {
        stocks: true,
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
    const result = await prisma.product.findUnique({
      where: {
        id: id,
      },
      include: {
        stocks: true,
      },
    });
    return result;
  } catch (error) {
    throw error;
  }
};

export const post = async (req, res) => {
  let fileName = "";
  try {
    const {
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
      importedDate,
      expiredDate,
      createdBy,
      lastUpdatedBy,
      objectVersionId,
    } = req.body;

    // First upload the file and wait for the response
    const uploadResponse = await upload.uploadFile(req, res, name);
    const image = uploadResponse.url;
    if (image) {
      fileName = uploadResponse.fileName;
    }

    // Use Prisma transaction to ensure atomic product and stock creation
    const result = await prisma.$transaction(async (prisma) => {
      // Create product in database
      const product = await prisma.product.create({
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
          image: image,
          createdBy: Number(createdBy),
          lastUpdatedBy: Number(lastUpdatedBy),
          objectVersionId: Number(objectVersionId),
        },
      });

      // Prepare stock data to match the stock model's post function structure
      const stockReq = {
        body: {
          productId: product.id,
          quantity: product.quantity,
          importedDate: importedDate,
          expiredDate: expiredDate,
          price: Number(price),
          salePrice: Number(salePrice),
          createdBy: product.createdBy,
          lastUpdatedBy: product.lastUpdatedBy,
          objectVersionId: product.objectVersionId,
        },
      };

      // Create stock entry using the existing stock model's post function
      const stockResult = await stock.post(stockReq);

      return { product, stockResult };
    });

    return result.product;

    // // Create product in database
    // const result = await prisma.product.create({
    //   data: {
    //     subCategoryId: Number(subCategoryId),
    //     manufacturerId: Number(manufacturerId),
    //     productTypeId: Number(productTypeId),
    //     productCode: productCode,
    //     name: name,
    //     shortName: shortName,
    //     description: description,
    //     longDescription: longDescription,
    //     barCode: barCode,
    //     quantity: Number(quantity),
    //     referenceNumber: referenceNumber,
    //     image: image,
    //     createdBy: Number(createdBy),
    //     lastUpdatedBy: Number(lastUpdatedBy),
    //     objectVersionId: Number(objectVersionId),
    //   },
    // });

    // return result;
  } catch (error) {
    if (fileName) {
      try {
        const deleteResponse = await upload.deleteFile(fileName);
        console.log(`Rolled back uploaded file: ${deleteResponse.fileName}`);
      } catch (deleteError) {
        console.error("Error rolling back file:", deleteError);
      }
    }
    console.error("Error in post product model:", error);
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
    console.error("Error in put product model:", error);
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
