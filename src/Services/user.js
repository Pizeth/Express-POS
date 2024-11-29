// services/userService.js
import bcrypt from "bcrypt";
import model from "../model/user.js";
import UserRepository from "../repositories/userRepository.js";
import upload from "../model/fileUpload.js";

const salt = bcrypt.genSaltSync(10);

export class UserService {
  // Register a new user
  static async registerUser(userData, req, res) {
    try {
      const { username, email, password, role, createdBy, lastUpdatedBy } =
        userData;

      // Validate unique constraints
      const existingUsername = await UserRepository.findByUsername(username);
      if (existingUsername) {
        throw new Error("Username already exists");
      }

      const existingEmail = await UserRepository.findByEmail(email);
      if (existingEmail) {
        throw new Error("Email already exists");
      }

      // Upload avatar if provided
      let avatarUrl = "";
      try {
        const uploadResponse = await upload.uploadFile(req, res, username);
        if (uploadResponse.status === 200) {
          avatarUrl = uploadResponse.url;
        }
      } catch (uploadError) {
        console.warn("Avatar upload failed:", uploadError);
      }

      // Hash password
      const hashedPassword = bcrypt.hashSync(password, salt);

      // Create user
      const newUser = await prisma.user.create({
        data: {
          username,
          email,
          password: hashedPassword,
          role,
          avatar: avatarUrl,
          createdBy: Number(createdBy),
          lastUpdatedBy: Number(lastUpdatedBy),
        },
      });

      return new User(newUser);
    } catch (error) {
      console.error("User registration error:", error);
      throw error;
    }
  }

  // Login user
  static async loginUser(credentials) {
    try {
      const { username } = credentials;

      // Find user by username or email
      const user = await prisma.user.findFirst({
        where: {
          OR: [
            { email: { equals: username, mode: "insensitive" } },
            { username: username },
          ],
        },
        include: {
          profile: true,
        },
      });

      if (!user) {
        throw new Error("User not found");
      }

      // Verify password
      const isPasswordValid = bcrypt.compareSync(
        credentials.password,
        user.password
      );
      if (!isPasswordValid) {
        throw new Error("Invalid credentials");
      }

      return new User(user);
    } catch (error) {
      console.error("User login error:", error);
      throw error;
    }
  }

  // Update user
  static async updateUser(userId, updateData, req, res) {
    try {
      const {
        username,
        email,
        password,
        avatar,
        role,
        createdBy,
        lastUpdatedBy,
      } = updateData;

      // Check if user exists
      const existingUser = await UserRepository.findById(userId);
      if (!existingUser) {
        throw new Error("User not found");
      }

      // Handle avatar upload
      let avatarUrl = avatar;
      try {
        const uploadResponse = await upload.uploadFile(req, res, username);
        if (uploadResponse.status === 200) {
          avatarUrl = uploadResponse.url;
        }
      } catch (uploadError) {
        console.warn("Avatar upload failed:", uploadError);
      }

      // Hash password if provided
      const hashedPassword = password
        ? bcrypt.hashSync(password, salt)
        : undefined;

      // Update user
      const updatedUser = await prisma.user.update({
        where: { id: Number(userId) },
        data: {
          username,
          email,
          ...(hashedPassword && { password: hashedPassword }),
          avatar: avatarUrl,
          role,
          createdBy: Number(createdBy),
          lastUpdatedBy: Number(lastUpdatedBy),
          objectVersionId: { increment: 1 },
        },
      });

      return new User(updatedUser);
    } catch (error) {
      console.error("User update error:", error);
      throw error;
    }
  }

  // Delete user
  static async deleteUser(userId) {
    try {
      const deletedUser = await prisma.user.delete({
        where: { id: Number(userId) },
      });

      return new User(deletedUser);
    } catch (error) {
      console.error(`Error deleting user ${userId}:`, error);
      throw error;
    }
  }
}

export default UserService;
