import prisma from "../Configs/connect.js";
import qr from "../Configs/qrCode.js";
import pagination from "../Utils/function.js";

export const get = async (req) => {
  try {
    // const result = await prisma.stock.findMany({});
    const result = await pagination.getPaginatedData({
      model: "stock",
      page: parseInt(req.query.page) || 1,
      pageSize: parseInt(req.query.pageSize) || 10,
    });
    console.log(await result);
    result.map((data) => ({
      id: data.id,
      productId: data.productId,
      quantity: data.quantity,
      price: data.price,
      salePrice: data.salePrice,
      importedDate: data.importedDate,
      expiredDate: data.expiredDate,
      qrCode: data.qrCode,
      createdBy: data.createdBy,
      creationDate: data.creationDate,
      lastUpdatedBy: data.lastUpdatedBy,
      lastUpdateDate: data.lastUpdateDate,
      objectVersionId: data.objectVersionId,
    }));
    return result;
  } catch (error) {
    console.error("Failed to fetch stock:", error);
    throw error;
  }
};

export const getId = async (req) => {
  try {
    const id = Number(req.params.id);
    const result = await prisma.stock.findUnique({
      where: {
        id: id,
      },
    });
    return result;
  } catch (error) {
    console.error("Failed to fetch stockId:", error);
    throw error;
  }
};

export const getQrCode = async (req) => {
  // Using map to flatten the structure
  const stocks = await prisma.stock
    .findMany({
      select: {
        id: true,
        expiredDate: true,
        productId: true,
        Product: {
          select: {
            barCode: true,
          },
        },
      },
    })
    .then((stocks) =>
      stocks.map((stock) => ({
        id: stock.id,
        expiredDate: stock.expiredDate,
        productId: stock.productId,
        barCode: stock.Product.barCode,
      }))
    );
  return stocks;
};

export const post = async (req) => {
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
    } = req.body;

    const metadata = {
      productId: productId,
      importedDate: importedDate,
      expiredDate: expiredDate,
    };

    const qrCode = qr.getQrCode(JSON.stringify(metadata));

    const result = prisma.$transaction(async (prisma) => {
      // 1. Get the current product to get existing quantity
      const product = await prisma.product.findUnique({
        where: { id: Number(productId) },
        select: { quantity: true },
      });

      if (!product) {
        throw new Error("Product not found");
      }

      // 2. Create new stock in database
      const stock = await prisma.stock.create({
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
        },
      });

      // 3. Update product quantity by adding new stock quantity
      const updatedProduct = await prisma.product.update({
        where: { id: stock.productId },
        data: {
          quantity: {
            increment: stock.quantity,
          },
        },
      });

      return {
        stock: stock,
        product: updatedProduct,
      };
    });

    return result;
  } catch (error) {
    console.error("Error in post stock model:", error);
    throw error; // Re-throw to be caught by the controller
  }
};

export const put = async (req, res) => {
  try {
    const {
      id,
      productId,
      quantity,
      importedDate,
      expiredDate,
      price,
      salePrice,
      createdBy,
      lastUpdatedBy,
    } = req.body;

    const metadata = {
      productId: productId,
      importedDate: importedDate,
      expiredDate: expiredDate,
    };

    const qrCode = qr.getQrCode(JSON.stringify(metadata));

    const result = prisma.$transaction(async (prisma) => {
      // 1. Get the current stock
      const currentStock = await prisma.stock.findUnique({
        where: { id: Number(id) },
      });

      if (!currentStock) {
        throw new Error("Stock not found");
      }

      // 2. Calculate quantity difference
      const quantityDifference = quantity - currentStock.quantity;

      // 3. Update stock in database
      const stock = await prisma.stock.update({
        where: {
          id: Number(id),
        },
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
          objectVersionId: { increment: 1 },
        },
      });

      // 4. Update product quantity by the difference
      const updatedProduct = await prisma.product.update({
        where: { id: stock.productId },
        data: {
          quantity: {
            increment: quantityDifference,
          },
        },
      });

      return {
        stock: stock,
        product: updatedProduct,
      };
    });

    return result;
  } catch (error) {
    console.error("Error in put stock model:", error);
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
