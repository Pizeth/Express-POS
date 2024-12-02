// repositories/userRepository.js
import prisma from "../Configs/connect.js";
import User from "../Models/user.js";
import pagination from "../Helpers/function.js";

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

  // Add method for bulk operations
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

  // Enhanced search method
  static async searchUsers(criteria, options = {}) {
    const {
      page = 1,
      pageSize = 10,
      orderBy = "creationDate",
      orderDirection = "desc",
    } = options;

    return prisma.user.findMany({
      where: {
        OR: [
          { username: { contains: criteria, mode: "insensitive" } },
          { email: { contains: criteria, mode: "insensitive" } },
        ],
        deletedAt: null, // Soft delete support
      },
      include: {
        profile: true,
      },
      orderBy: { [orderBy]: orderDirection },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
  }
}

export default UserRepository;
