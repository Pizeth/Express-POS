// repositories/userRepository.js
import prisma from "../Configs/connect.js";
import User from "../Models/user.js";
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
        },
      });
      result.data.map((data) => new User(data));
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
        },
      });
      return user ? new User(user) : null;
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
      return user ? new User(user) : null;
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
      return user ? new User(user) : null;
    } catch (error) {
      console.error(`Error finding user with email ${email}:`, error);
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
          data: new User(user).toJSON(),
        })
      )
    );
  }

  // Add method for conditional updates
  static async updateUserStatus(id, updates) {
    return prisma.user.update({
      where: { id: Number(id) },
      data: {
        ...updates,
        lastUpdateDate: new Date(),
      },
    });
  }

  // Implement login attempt tracking
  static async incrementLoginAttempts(id) {
    return prisma.user.update({
      where: { id: id },
      data: {
        loginAttempts: { increment: 1 },
        lastLoginAttempt: new Date(),
      },
    });
  }

  static async resetLoginAttempts(id) {
    return prisma.user.update({
      where: { id: id },
      data: {
        loginAttempts: 0,
        lastLogin: null,
      },
    });
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
}

export default UserRepository;
