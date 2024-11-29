// repositories/userRepository.js
import prisma from "../Configs/connect.js";
import { User } from "../model/user.js";

export class UserRepository {
  // Get paginated users
  static async getPaginatedUsers(page = 1, pageSize = 10) {
    try {
      const result = await prisma.user.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
          profile: true,
        },
        orderBy: {
          creationDate: "desc",
        },
      });

      const total = await prisma.user.count();

      return {
        data: result.map((user) => new User(user)),
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      };
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
}

export default UserRepository;
