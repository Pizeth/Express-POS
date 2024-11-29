import { PrismaClient } from "@prisma/client";

class ProductStockService {
  constructor(prisma) {
    this.prisma = prisma || new PrismaClient();
  }

  /**
   * Converts a given quantity from one unit to its base unit
   * @param {number} quantity - Quantity to convert
   * @param {object} unitHierarchy - Unit hierarchy configuration
   * @returns {number} Converted base unit quantity
   */
  async convertToBaseUnit(productId, unitId, quantity) {
    // Find the unit hierarchy for this specific product and unit
    const hierarchyConfig = await this.prisma.unitHierarchy.findFirst({
      where: {
        productId: productId,
        childUnitId: unitId,
      },
      include: {
        parentUnit: true,
        childUnit: true,
      },
    });

    // If no specific hierarchy found, return the original quantity
    if (!hierarchyConfig) {
      return quantity;
    }

    // Calculate base unit quantity
    return quantity * hierarchyConfig.quantity;
  }

  /**
   * Add new stock for a product
   * @param {object} stockData - Stock data to add
   * @returns {object} Created stock entry
   */
  async addStock(stockData) {
    // Begin a transaction to ensure atomic operations
    return this.prisma.$transaction(async (prisma) => {
      // First, convert the incoming stock quantity to base unit
      const baseUnitQuantity = await this.convertToBaseUnit(
        stockData.productId,
        stockData.unitId,
        stockData.unitQuantity
      );

      // Create the new stock entry
      const newStock = await prisma.stock.create({
        data: {
          ...stockData,
          baseUnitQty: baseUnitQuantity,
        },
      });

      // Update the product's base unit quantity
      await prisma.product.update({
        where: { id: stockData.productId },
        data: {
          baseUnitQty: {
            increment: baseUnitQuantity,
          },
        },
      });

      return newStock;
    });
  }

  /**
   * Update existing stock
   * @param {number} stockId - ID of the stock to update
   * @param {object} updateData - Data to update
   * @returns {object} Updated stock entry
   */
  async updateStock(stockId, updateData) {
    return this.prisma.$transaction(async (prisma) => {
      // First, get the existing stock to compare changes
      const existingStock = await prisma.stock.findUnique({
        where: { id: stockId },
        select: {
          productId: true,
          unitId: true,
          unitQuantity: true,
          baseUnitQty: true,
        },
      });

      if (!existingStock) {
        throw new Error("Stock entry not found");
      }

      // Determine the base unit quantity change
      let baseUnitQuantityChange = 0;
      if (updateData.unitQuantity !== undefined) {
        const newBaseUnitQuantity = await this.convertToBaseUnit(
          existingStock.productId,
          existingStock.unitId,
          updateData.unitQuantity
        );

        // Calculate the difference in base unit quantity
        baseUnitQuantityChange =
          newBaseUnitQuantity - existingStock.baseUnitQty;
      }

      // Update the stock
      const updatedStock = await prisma.stock.update({
        where: { id: stockId },
        data: {
          ...updateData,
          ...(baseUnitQuantityChange !== 0
            ? {
                baseUnitQty: existingStock.baseUnitQty + baseUnitQuantityChange,
              }
            : {}),
        },
      });

      // Update the product's base unit quantity if changed
      if (baseUnitQuantityChange !== 0) {
        await prisma.product.update({
          where: { id: existingStock.productId },
          data: {
            baseUnitQty: {
              increment: baseUnitQuantityChange,
            },
          },
        });
      }

      return updatedStock;
    });
  }

  /**
   * Remove stock entry and adjust product base unit quantity
   * @param {number} stockId - ID of the stock to remove
   */
  async removeStock(stockId) {
    return this.prisma.$transaction(async (prisma) => {
      // Get the stock entry to be deleted
      const stockToDelete = await prisma.stock.findUnique({
        where: { id: stockId },
        select: {
          productId: true,
          baseUnitQty: true,
        },
      });

      if (!stockToDelete) {
        throw new Error("Stock entry not found");
      }

      // Delete the stock entry
      await prisma.stock.delete({
        where: { id: stockId },
      });

      // Adjust the product's base unit quantity
      await prisma.product.update({
        where: { id: stockToDelete.productId },
        data: {
          baseUnitQty: {
            decrement: stockToDelete.baseUnitQty,
          },
        },
      });
    });
  }

  /**
   * Get total base unit quantity for a product
   * @param {number} productId - ID of the product
   * @returns {number} Total base unit quantity
   */
  async getProductTotalBaseUnitQuantity(productId) {
    const totalStock = await this.prisma.stock.aggregate({
      where: { productId: productId },
      _sum: { baseUnitQty: true },
    });

    return totalStock._sum.baseUnitQty || 0;
  }
}

export default ProductStockService;
