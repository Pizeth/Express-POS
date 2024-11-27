import { PrismaClient } from "@prisma/client";

class StockService {
  constructor() {
    this.prisma = new PrismaClient();
  }

  /**
   * Create a new stock and update product quantity
   * @param {Object} stockData - Stock creation data
   * @returns {Promise} Created stock
   */
  async createStock(stockData) {
    return this.prisma.$transaction(async (tx) => {
      // 1. Create new stock
      const newStock = await tx.stock.create({
        data: stockData,
      });

      // 2. Recalculate total quantity for the product
      const totalQuantity = await tx.stock.aggregate({
        where: { productId: stockData.productId },
        _sum: { quantity: true },
      });

      // 3. Update product quantity
      await tx.product.update({
        where: { id: stockData.productId },
        data: {
          quantity: totalQuantity._sum.quantity || 0,
        },
      });

      return newStock;
    });
  }

  /**
   * Update stock quantity and recalculate product total
   * @param {number} stockId - ID of the stock to update
   * @param {number} newQuantity - New quantity for the stock
   * @returns {Promise} Updated stock
   */
  async updateStockQuantity(stockId, newQuantity) {
    return this.prisma.$transaction(async (tx) => {
      // 1. Get the current stock
      const currentStock = await tx.stock.findUnique({
        where: { id: stockId },
      });

      if (!currentStock) {
        throw new Error("Stock not found");
      }

      // 2. Update the specific stock
      const updatedStock = await tx.stock.update({
        where: { id: stockId },
        data: { quantity: newQuantity },
      });

      // 3. Recalculate total product quantity
      const totalQuantity = await tx.stock.aggregate({
        where: { productId: currentStock.productId },
        _sum: { quantity: true },
      });

      // 4. Update product quantity
      await tx.product.update({
        where: { id: currentStock.productId },
        data: {
          quantity: totalQuantity._sum.quantity || 0,
        },
      });

      return updatedStock;
    });
  }

  /**
   * Bulk update stocks for a product
   * @param {number} productId - ID of the product
   * @param {Array} stockUpdates - Array of stock updates
   * @returns {Promise} Updated stocks
   */
  async bulkUpdateStocks(productId, stockUpdates) {
    return this.prisma.$transaction(async (tx) => {
      // 1. Perform bulk stock updates
      const updatedStocks = await Promise.all(
        stockUpdates.map((update) =>
          tx.stock.update({
            where: { id: update.id },
            data: {
              quantity: update.quantity,
              price: update.price,
              // Add other updatable fields
            },
          })
        )
      );

      // 2. Recalculate total quantity for the product
      const totalQuantity = await tx.stock.aggregate({
        where: { productId: productId },
        _sum: { quantity: true },
      });

      // 3. Update product quantity
      await tx.product.update({
        where: { id: productId },
        data: {
          quantity: totalQuantity._sum.quantity || 0,
        },
      });

      return updatedStocks;
    });
  }

  /**
   * Delete a stock and update product quantity
   * @param {number} stockId - ID of the stock to delete
   * @returns {Promise} Deleted stock
   */
  async deleteStock(stockId) {
    return this.prisma.$transaction(async (tx) => {
      // 1. Get the current stock
      const currentStock = await tx.stock.findUnique({
        where: { id: stockId },
      });

      if (!currentStock) {
        throw new Error("Stock not found");
      }

      // 2. Delete the stock
      const deletedStock = await tx.stock.delete({
        where: { id: stockId },
      });

      // 3. Recalculate total product quantity
      const totalQuantity = await tx.stock.aggregate({
        where: { productId: currentStock.productId },
        _sum: { quantity: true },
      });

      // 4. Update product quantity
      await tx.product.update({
        where: { id: currentStock.productId },
        data: {
          quantity: totalQuantity._sum.quantity || 0,
        },
      });

      return deletedStock;
    });
  }

  /**
   * Prisma middleware for automatic quantity updates
   */
  setupMiddleware() {
    this.prisma.$use(async (params, next) => {
      // Stock creation middleware
      if (params.model === "Stock" && params.action === "create") {
        const createdStock = await next(params);

        // Recalculate total quantity
        const totalQuantity = await this.prisma.stock.aggregate({
          where: { productId: createdStock.productId },
          _sum: { quantity: true },
        });

        // Update product quantity
        await this.prisma.product.update({
          where: { id: createdStock.productId },
          data: {
            quantity: totalQuantity._sum.quantity || 0,
          },
        });

        return createdStock;
      }

      // Stock update middleware
      if (params.model === "Stock" && params.action === "update") {
        const updatedStock = await next(params);

        // Recalculate total quantity
        const totalQuantity = await this.prisma.stock.aggregate({
          where: { productId: updatedStock.productId },
          _sum: { quantity: true },
        });

        // Update product quantity
        await this.prisma.product.update({
          where: { id: updatedStock.productId },
          data: {
            quantity: totalQuantity._sum.quantity || 0,
          },
        });

        return updatedStock;
      }

      // Stock delete middleware
      if (params.model === "Stock" && params.action === "delete") {
        const deletedStock = await next(params);

        // Recalculate total quantity
        const totalQuantity = await this.prisma.stock.aggregate({
          where: { productId: deletedStock.productId },
          _sum: { quantity: true },
        });

        // Update product quantity
        await this.prisma.product.update({
          where: { id: deletedStock.productId },
          data: {
            quantity: totalQuantity._sum.quantity || 0,
          },
        });

        return deletedStock;
      }

      return next(params);
    });
  }
}

// Export the service as default
export default StockService;
