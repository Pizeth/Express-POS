// repositories/userRepository.js
import prisma from "../Configs/connect.js";
import model from "../Models/user.js";
import pagination from "../Utils/function.js";

export class UserRepository {
  static async findUsers(page, pageSize, orderBy, orderDirection) {
    try {
      const result = await pagination.getPaginatedData({
        model: "user",
        page: parseInt(page) || 1,
        pageSize: parseInt(pageSize) || 10,
        orderBy,
        orderDirection,
        include: {
          profile: true,
          refreshTokens: true,
        },
      });
      result.data.map((data) => new model.User(data));
      return result;
    } catch (error) {
      console.error("Error fetching paginated users:", error);
      throw error;
    }
  }

  // Find user by ID
  static async findById(id) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: Number(id) },
        include: {
          profile: true,
          // refreshTokens: true,
          auditTrail: true,
        },
      });
      return user ? new model.User(user) : null;
    } catch (error) {
      console.error(`Error finding user with id ${id}:`, error);
      throw error;
    }
  }

  // Find user by username
  static async findByUsername(username) {
    try {
      const user = await prisma.user.findFirst({
        where: {
          username: {
            equals: username,
            mode: "insensitive",
          },
        },
      });
      return user ? new model.User(user) : null;
    } catch (error) {
      console.error(`Error finding user with username ${username}:`, error);
      throw error;
    }
  }

  // Find user by email
  static async findByEmail(email) {
    try {
      const user = await prisma.user.findFirst({
        where: {
          email: {
            equals: email,
            mode: "insensitive",
          },
        },
      });
      return user ? new model.User(user) : null;
    } catch (error) {
      console.error(`Error finding user with email ${email}:`, error);
      throw error;
    }
  }

  // Find user by username or email
  static async findUser(input) {
    try {
      const user = await prisma.user.findFirst({
        where: {
          OR: [
            { email: { equals: input, mode: "insensitive" } },
            { username: input },
          ],
        },
        include: {
          profile: true,
          // auditTrail: true,
        },
      });
      // console.log(user);
      return user ? new model.User(user) : null;
    } catch (error) {
      console.error(`Error finding user ${input}:`, error);
      throw error;
    }
  }

  // Paginated user search with advanced filtering
  static async searchUsers(criteria = {}) {
    const {
      search = "",
      page = 1,
      pageSize = 10,
      sortBy = "creationDate",
      sortOrder = "desc",
    } = criteria;

    const where = search
      ? {
          OR: [
            { username: { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } },
          ],
        }
      : {};

    const totalCount = await prisma.user.count({ where });

    const users = await prisma.user.findMany({
      where,
      take: pageSize,
      skip: (page - 1) * pageSize,
      orderBy: { [sortBy]: sortOrder },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        creationDate: true,
      },
    });

    return {
      users,
      pagination: {
        currentPage: page,
        pageSize,
        totalCount,
        totalPages: Math.ceil(totalCount / pageSize),
      },
    };
  }

  // Bulk create users within a transaction
  static async bulkCreate(users) {
    return prisma.$transaction(
      users.map((user) =>
        prisma.user.create({
          data: new model.User(user).toJSON(),
        })
      )
    );
  }

  // Add method for conditional updates
  static async updateUserStatus(id, updates) {
    try {
      return prisma.user.update({
        where: { id: Number(id) },
        data: {
          ...updates,
          lastUpdateDate: new Date(),
        },
      });
    } catch (error) {
      console.error("Error update user locking status:", error);
      throw error;
    }
  }

  // Implement login attempt tracking
  static async incrementLoginAttempts(user) {
    try {
      return prisma.user.update({
        where: { id: Number(user.id) },
        data: {
          loginAttempts: { increment: 1 },
          lastLogin: new Date(),
          isLocked: user.loginAttempts >= 5, // Lock after 5 failed attempts
        },
      });
    } catch (error) {
      console.error("Error increment user login attempts:", error);
      throw error;
    }
  }

  static async resetLoginAttempts(id) {
    try {
      await prisma.user.update({
        where: { id: id },
        data: {
          loginAttempts: 0,
          lastLogin: new Date(),
          isLocked: false,
        },
      });
    } catch (error) {
      console.error("Error resetting user login attempts:", error);
      throw error;
    }
  }

  // Soft delete implementation
  static async softDelete(id) {
    return prisma.user.update({
      where: { id: id },
      data: {
        deletedAt: new Date(),
        enabledFlag: false,
      },
    });
  }

  // Batch operations with transaction support
  static async bulkUpdateStatus(userIds, status) {
    return prisma.$transaction(
      userIds.map((id) =>
        prisma.user.update({
          where: { id },
          data: {
            enabledFlag: status,
            lastUpdateDate: new Date(),
          },
        })
      )
    );
  }
}

export default UserRepository;

// // Enhanced search method
// static async searchUsers(criteria, options = {}) {
//   const {
//     page = 1,
//     pageSize = 10,
//     orderBy = "creationDate",
//     orderDirection = "desc",
//   } = options;

//   return prisma.user.findMany({
//     where: {
//       OR: [
//         { username: { contains: criteria, mode: "insensitive" } },
//         { email: { contains: criteria, mode: "insensitive" } },
//       ],
//       deletedAt: null, // Soft delete support
//     },
//     include: {
//       profile: true,
//     },
//     orderBy: { [orderBy]: orderDirection },
//     skip: (page - 1) * pageSize,
//     take: pageSize,
//   });
// }
