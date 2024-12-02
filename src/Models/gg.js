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

// import { PrismaClient } from '@prisma/client'
// import { Decimal } from '@prisma/client/runtime/library'

// export class UnitConversionService {
//   private prisma: PrismaClient

//   constructor(prismaClient?: PrismaClient) {
//     this.prisma = prismaClient || new PrismaClient()
//   }

//   /**
//    * Fetch the complete unit hierarchy for a specific product
//    * @param productId - ID of the product
//    * @returns Detailed unit hierarchy configuration
//    */
//   async getProductUnitHierarchy(productId: number) {
//     return this.prisma.unitHierarchy.findMany({
//       where: { productId },
//       include: {
//         parentUnit: true,
//         childUnit: true
//       }
//     })
//   }

//   /**
//    * Calculate the base unit quantity when adding or updating stock
//    * @param productId - ID of the product
//    * @param unitId - ID of the unit being added/updated
//    * @param quantity - Quantity in the given unit
//    * @returns Base unit quantity
//    */
//   async calculateBaseUnitQuantity(
//     productId: number,
//     unitId: number,
//     quantity: number
//   ): Promise<Decimal> {
//     // First, check if this is already a base unit
//     const product = await this.prisma.product.findUnique({
//       where: { id: productId },
//       select: { baseUnitId: true }
//     })

//     if (product?.baseUnitId === unitId) {
//       return new Decimal(quantity)
//     }

//     // Find the unit hierarchy for this product and specific unit
//     const hierarchy = await this.prisma.unitHierarchy.findFirst({
//       where: {
//         productId,
//         parentUnitId: unitId
//       },
//       include: {
//         childUnit: true
//       }
//     })

//     if (!hierarchy) {
//       throw new Error(`No unit hierarchy found for product ${productId} and unit ${unitId}`)
//     }

//     // Calculate base unit quantity
//     return new Decimal(quantity).mul(hierarchy.quantity)
//   }

//   /**
//    * Add new stock with automatic base unit quantity calculation
//    * @param data - Stock creation data
//    * @returns Created stock
//    */
//   async addStock(data: {
//     productId: number,
//     unitId: number,
//     unitQuantity: number,
//     price: number,
//     salePrice?: number,
//     importedDate: Date,
//     expiredDate?: Date
//   }) {
//     // Calculate base unit quantity
//     const baseUnitQty = await this.calculateBaseUnitQuantity(
//       data.productId,
//       data.unitId,
//       data.unitQuantity
//     )

//     // Generate QR Code (you might want to implement a more sophisticated QR code generation)
//     const qrCode = this.generateQRCode(data.productId, data.unitId, data.unitQuantity)

//     // Create stock entry
//     return this.prisma.stock.create({
//       data: {
//         productId: data.productId,
//         unitId: data.unitId,
//         baseUnitQty: baseUnitQty,
//         unitQuantity: new Decimal(data.unitQuantity),
//         price: new Decimal(data.price),
//         salePrice: data.salePrice ? new Decimal(data.salePrice) : undefined,
//         importedDate: data.importedDate,
//         expiredDate: data.expiredDate,
//         qrCode: qrCode,
//         createdBy: 1, // You should replace this with actual user ID
//         lastUpdatedBy: 1 // You should replace this with actual user ID
//       }
//     })
//   }

//   /**
//    * Update existing stock with automatic base unit quantity recalculation
//    * @param stockId - ID of the stock to update
//    * @param data - Stock update data
//    * @returns Updated stock
//    */
//   async updateStock(
//     stockId: number,
//     data: {
//       unitId?: number,
//       unitQuantity?: number,
//       price?: number,
//       salePrice?: number
//     }
//   ) {
//     // Fetch current stock to get product details
//     const currentStock = await this.prisma.stock.findUnique({
//       where: { id: stockId },
//       select: { productId: true, unitId: true, unitQuantity: true }
//     })

//     if (!currentStock) {
//       throw new Error(`Stock with ID ${stockId} not found`)
//     }

//     // Determine which values to update
//     const updateData: any = {}

//     // Recalculate base unit quantity if unit or quantity changed
//     if (data.unitId || data.unitQuantity) {
//       const unitId = data.unitId || currentStock.unitId
//       const unitQuantity = data.unitQuantity ?? currentStock.unitQuantity

//       const baseUnitQty = await this.calculateBaseUnitQuantity(
//         currentStock.productId,
//         unitId,
//         Number(unitQuantity)
//       )

//       updateData.baseUnitQty = baseUnitQty
//       updateData.unitId = unitId
//       updateData.unitQuantity = new Decimal(unitQuantity)
//     }

//     // Update other fields
//     if (data.price) updateData.price = new Decimal(data.price)
//     if (data.salePrice) updateData.salePrice = new Decimal(data.salePrice)

//     // Perform update
//     return this.prisma.stock.update({
//       where: { id: stockId },
//       data: {
//         ...updateData,
//         lastUpdatedBy: 1, // Replace with actual user ID
//         lastUpdateDate: new Date()
//       }
//     })
//   }

//   /**
//    * Simple QR Code generation (you might want to use a more robust solution)
//    * @param productId
//    * @param unitId
//    * @param quantity
//    * @returns
//    */
//   private generateQRCode(productId: number, unitId: number, quantity: number): string {
//     return `STOCK-P${productId}-U${unitId}-Q${quantity}-${Date.now()}`
//   }

//   /**
//    * Set up product-specific unit hierarchy
//    * @param productId
//    * @param hierarchyConfig
//    */
//   async setupProductUnitHierarchy(
//     productId: number,
//     hierarchyConfig: Array<{
//       parentUnitId: number,
//       childUnitId: number,
//       quantity: number
//     }>
//   ) {
//     // Begin transaction to ensure data integrity
//     const result = await this.prisma.$transaction(async (prisma) => {
//       // First, remove existing hierarchies for this product
//       await prisma.unitHierarchy.deleteMany({
//         where: { productId }
//       })

//       // Then create new hierarchies
//       return prisma.unitHierarchy.createMany({
//         data: hierarchyConfig.map(config => ({
//           productId,
//           parentUnitId: config.parentUnitId,
//           childUnitId: config.childUnitId,
//           quantity: new Decimal(config.quantity)
//         }))
//       })
//     })

//     return result
//   }

//   /**
//    * Example method to demonstrate usage for different products
//    */
//   async setupExampleProductHierarchies() {
//     // Example for Paracetamol
//     await this.setupProductUnitHierarchy(1, [
//       {
//         parentUnitId: 1, // Box unit ID
//         childUnitId: 2,  // Tablet unit ID
//         quantity: 12     // 1 box contains 12 tablets
//       },
//       {
//         parentUnitId: 2,  // Tablet unit ID
//         childUnitId: 3,   // Pill unit ID
//         quantity: 10      // 1 tablet contains 10 pills
//       }
//     ])

//     // Example for Amoxicillin
//     await this.setupProductUnitHierarchy(2, [
//       {
//         parentUnitId: 1,  // Box unit ID
//         childUnitId: 2,   // Tablet unit ID
//         quantity: 10      // 1 box contains 10 tablets
//       },
//       {
//         parentUnitId: 2,  // Tablet unit ID
//         childUnitId: 3,   // Pill unit ID
//         quantity: 12      // 1 tablet contains 12 pills
//       }
//     ])

//     // Example for Clamoxyl
//     await this.setupProductUnitHierarchy(3, [
//       {
//         parentUnitId: 1,  // Box unit ID
//         childUnitId: 4,   // Sachet unit ID
//         quantity: 12      // 1 box contains 12 sachets
//       }
//     ])
//   }
// }

// // Example usage
// async function exampleUsage() {
//   const service = new UnitConversionService()

//   // Setup product hierarchies
//   await service.setupExampleProductHierarchies()

//   // Add stock for Paracetamol: 2 boxes
//   const paracetamolStock = await service.addStock({
//     productId: 1,
//     unitId: 1, // Box unit
//     unitQuantity: 2,
//     price: 10,
//     importedDate: new Date()
//   })

//   // Update stock
//   await service.updateStock(paracetamolStock.id, {
//     unitQuantity: 3
//   })
// }

// const { Decimal, PrismaClient } = require('@prisma/client');

// // Custom error for conversion issues
// class UnitConversionError extends Error {
//   constructor(message) {
//     super(message);
//     this.name = 'UnitConversionError';
//   }
// }

// // Complex Unit Conversion Service
// class UnitConversionService {
//   constructor(prismaClient) {
//     this.prisma = prismaClient;
//     this.conversionCache = new Map();
//   }

//   // Generate a unique cache key for conversion
//   getCacheKey(fromUnitId, toUnitId, productId) {
//     return productId ? `${fromUnitId}-${toUnitId}-${productId}` : `${fromUnitId}-${toUnitId}`;
//   }

//   // Fetch and cache unit conversions
//   async loadConversions(fromUnitId, toUnitId) {
//     const cacheKey = this.getCacheKey(fromUnitId, toUnitId);
//     // Check if already cached
//     if (this.conversionCache.has(cacheKey)) {
//       return [this.conversionCache.get(cacheKey)];
//     }
//     // Fetch conversions from database
//     const conversions = await this.prisma.unitConversion.findMany({
//       where: { fromUnitId, toUnitId, enabledFlag: true }
//     });
//     // Cache the conversions
//     conversions.forEach(conversion => {
//       this.conversionCache.set(cacheKey, {
//         id: conversion.id,
//         fromUnitId: conversion.fromUnitId,
//         toUnitId: conversion.toUnitId,
//         conversionFactor: Number(conversion.conversionFactor)
//       });
//     });
//     return conversions;
//   }

//   // Fetch composite unit details
//   async getCompositeUnit(productId) {
//     const compositeUnit = await this.prisma.compositeUnit.findFirst({
//       where: { productId },
//       include: { unit: true } // Include related unit details
//     });
//     if (!compositeUnit) {
//       throw new UnitConversionError(`Composite unit not found for product ${productId}`);
//     }
//     return compositeUnit;
//   }

//   // Main conversion method
//   async convertUnits(fromUnitId, toUnitId, quantity, productId) {
//     try {
//       // Fetch standard conversions
//       const conversions = await this.loadConversions(fromUnitId, toUnitId);

//       // Find a valid conversion
//       const validConversion = conversions.find(conv => true); // All conversions are valid without additional checks
//       if (validConversion) {
//         return quantity * validConversion.conversionFactor;
//       }

//       // If no standard conversion found, handle composite unit conversion
//       if (productId) {
//         const compositeUnit = await this.getCompositeUnit(productId);
//         if (compositeUnit.unitId === fromUnitId && compositeUnit.baseUnitId === toUnitId) {
//           return quantity * compositeUnit.baseUnitQuantity;
//         } else if (compositeUnit.baseUnitId === fromUnitId && compositeUnit.unitId === toUnitId) {
//           return quantity / compositeUnit.baseUnitQuantity;
//         }
//       }

//       throw new UnitConversionError(`No valid conversion found from unit ${fromUnitId} to unit ${toUnitId}`);
//     } catch (error) {
//       console.error('Unit conversion error:', error);
//       throw error;
//     }
//   }

//   // Bulk conversion method for multiple units
//   async convertMultipleUnits(conversionRequests) {
//     return Promise.all(
//       conversionRequests.map(req =>
//         this.convertUnits(req.fromUnitId, req.toUnitId, req.quantity, req.productId)
//       )
//     );
//   }

//   // Method to add or update a conversion
//   async upsertConversion(conversionConfig) {
//     try {
//       const conversion = await this.prisma.unitConversion.upsert({
//         where: {
//           id: conversionConfig.id || 0,
//           fromUnitId_toUnitId: { fromUnitId: conversionConfig.fromUnitId, toUnitId: conversionConfig.toUnitId }
//         },
//         update: {
//           conversionFactor: conversionConfig.conversionFactor
//         },
//         create: {
//           fromUnitId: conversionConfig.fromUnitId,
//           toUnitId: conversionConfig.toUnitId,
//           conversionFactor: conversionConfig.conversionFactor
//         }
//       });

//       // Invalidate cache for this conversion
//       const cacheKey = this.getCacheKey(conversion.fromUnitId, conversion.toUnitId);
//       this.conversionCache.delete(cacheKey);
//       return conversion;
//     } catch (error) {
//       console.error('Error upserting conversion:', error);
//       throw new UnitConversionError('Failed to upsert conversion');
//     }
//   }

//   // Clear conversion cache
//   clearCache() {
//     this.conversionCache.clear();
//   }
// }

// // Example usage
// async function exampleUsage() {
//   const prisma = new PrismaClient();
//   const conversionService = new UnitConversionService(prisma);

//   try {
//     // Convert 2 boxes to tablets for a specific product
//     const convertedQuantity = await conversionService.convertUnits(
//       boxUnitId,
//       tabletUnitId,
//       2,
//       specificProductId
//     );

//     // Bulk conversion
//     const bulkConversions = await conversionService.convertMultipleUnits([
//       { fromUnitId: boxUnitId, toUnitId: tabletUnitId, quantity: 2, productId: specificProductId },
//       { fromUnitId: tabletUnitId, toUnitId: pillUnitId, quantity: 10 }
//     ]);

//     // Add a new conversion
//     await conversionService.upsertConversion({
//       fromUnitId: boxUnitId,
//       toUnitId: tabletUnitId,
//       conversionFactor: 12
//     });
//   } catch (error) {
//     if (error instanceof UnitConversionError) {
//       console.error('Conversion error:', error.message);
//     }
//   }
// }

// // Export for potential use in other modules
// module.exports = UnitConversionService;

// export const getUser = async (req) => {
//   try {
//     // const result = await prisma.stock.findMany({});
//     const result = await pagination.getPaginatedData({
//       model: "user",
//       page: parseInt(req.query.page) || 1,
//       pageSize: parseInt(req.query.pageSize) || 10,
//       include: {
//         profile: true,
//       },
//     });
//     console.log(await result);
//     result.data.map((data) => ({
//       id: data.id,
//       username: data.username,
//       email: data.email,
//       password: data.password,
//       avatar: data.avatar,
//       profile: data.profile,
//       isBan: data.isBan,
//       enabledFlag: data.enabledFlag,
//       role: data.role,
//       createdBy: data.createdBy,
//       creationDate: data.creationDate,
//       lastUpdatedBy: data.lastUpdatedBy,
//       lastUpdateDate: data.lastUpdateDate,
//       objectVersionId: data.objectVersionId,
//     }));
//     console.log(result);
//     return result;

//     // const allUsers = await prisma.user.findMany({
//     //   include: {
//     //     profile: true,
//     //   },
//     // });
//     // return allUsers;
//   } catch (error) {
//     console.log(error);
//     throw error;
//   }
// };

// export const getUserId = async (req) => {
//   try {
//     const userId = Number(req.params.id);
//     const user = await prisma.user.findUnique({
//       where: {
//         id: userId,
//       },
//       include: {
//         profile: true,
//       },
//     });
//     const result = new User(user);
//     console.log(result);
//     return user;
//   } catch (error) {
//     throw error;
//   }
// };

// export const getUsername = async (req) => {
//   try {
//     const username = req.params.username;
//     console.log(username);
//     const user = await prisma.user.findFirst({
//       where: {
//         username: { equals: username, mode: "insensitive" },
//       },
//     });
//     return user;
//   } catch (error) {
//     console.error("Error checking username: ", error);
//     throw error;
//   }
// };

// export const getEmail = async (req) => {
//   try {
//     const email = req.params.email;
//     console.log(email);
//     const user = await prisma.user.findFirst({
//       where: {
//         email: { equals: email, mode: "insensitive" },
//       },
//     });
//     return user;
//   } catch (error) {
//     console.error("Error checking email: ", error);
//     throw error;
//   }
// };

// export const registerUser = async (req, res) => {
//   try {
//     const { username, email, password, role, createdBy, lastUpdatedBy } =
//       req.body;

//     // First upload the file and wait for the response
//     const uploadResponse = await upload.uploadFile(req, res, username);
//     let avatar = "";
//     if (uploadResponse.status == 200) {
//       avatar = uploadResponse.url;
//       console.log("avatar url: " + avatar);
//     } else {
//       console.log(uploadResponse);
//     }

//     // Hash password
//     const pass = bcrypt.hashSync(password, salt);

//     // Create user in database
//     const user_data = await prisma.user.create({
//       data: {
//         username: username,
//         email: email,
//         password: pass,
//         role: role,
//         avatar: avatar,
//         createdBy: Number(createdBy),
//         lastUpdatedBy: Number(lastUpdatedBy),
//       },
//     });

//     return user_data;
//   } catch (error) {
//     console.error("Error in registerUser model:", error);
//     throw error; // Re-throw to be caught by the controller
//   }
// };

// export const putUser = async (req, res) => {
//   try {
//     const {
//       id,
//       username,
//       email,
//       password,
//       avatar,
//       role,
//       createdBy,
//       lastUpdatedBy,
//     } = req.body;

//     const pass = bcrypt.hashSync(password, salt);

//     // First upload the file and wait for the response
//     const uploadResponse = await upload.uploadFile(req, res, shortName);
//     let image = avatar;
//     if (uploadResponse.status == 200) {
//       image = uploadResponse.url;
//     }

//     const user_data = await prisma.user.update({
//       where: {
//         id: Number(id),
//       },
//       data: {
//         username: username,
//         email: email,
//         password: pass,
//         avatar: image,
//         role: role,
//         createdBy: Number(createdBy),
//         lastUpdatedBy: Number(lastUpdatedBy),
//         objectVersionId: { increment: 1 },
//       },
//     });
//     return user_data;
//   } catch (error) {
//     throw error;
//   }
// };

// export const loginUser = async (req) => {
//   try {
//     const { username } = req.body;
//     console.log(username);
//     const login_user = await prisma.user.findFirst({
//       where: {
//         // username: username,
//         OR: [
//           {
//             email: { equals: username, mode: "insensitive" },
//           },
//           { username: username },
//         ],
//       },

//       include: {
//         profile: true,
//       },
//     });
//     return login_user;
//   } catch (error) {
//     console.log(error);
//     throw error;
//   }
// };

// export const deleteUser = async (req) => {
//   try {
//     const userId = Number(req.params.id);
//     const user = await prisma.user.delete({
//       where: {
//         id: Number(userId),
//       },
//     });
//     return user;
//   } catch (error) {
//     throw error;
//   }
// };

// exports.registerUser = (req) => {
//   const body = req.body;
//   const pass = bcrypt.hashSync(body.password, salt);
//   return new Promise((resolve, reject) => {
//     conn.query(
//       `INSERT INTO user SET username = ?, password = ?`,
//       [body.username, pass],
//       (err, result) => {
//         if (!err) resolve(result);
//         else reject(err);
//       }
//     );
//   });
// };

// exports.loginUser = (req) => {
//   return new Promise((resolve, reject) => {
//     conn.query(
//       `SELECT * FROM user WHERE username = ?`,
//       [req.body.username],
//       (err, result) => {
//         if (!err) resolve(result);
//         else reject(err);
//       }
//     );
//   });
// };
