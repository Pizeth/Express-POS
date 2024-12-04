// services/userService.js
import prisma from "../Configs/connect.js";
import User from "../Models/user.js";
import UserRepository from "../Repository/user.js";
import upload from "../Services/fileUpload.js";
import { logError } from "../Helpers/form.js";
import bcrypt from "bcrypt";
import user from "../Controllers/user.js";

const salt = bcrypt.genSaltSync(10);

export class UserService {
  // Register a new user
  // static async register(userData, req, res) {
  //   let fileName = "";
  //   try {
  //     const { username, email, password, role, createdBy, lastUpdatedBy } =
  //       userData;

  //     // Validate unique constraints
  //     const existingUsername = await UserRepository.findByUsername(username);
  //     if (existingUsername) {
  //       throw new Error("Username already exists");
  //     }

  //     const existingEmail = await UserRepository.findByEmail(email);
  //     if (existingEmail) {
  //       throw new Error("Email already exists");
  //     }

  //     // Upload avatar if provided
  //     let avatar = "";
  //     try {
  //       const uploadResponse = await upload.uploadFile(req, res, username);
  //       if (uploadResponse.status === 200) {
  //         avatar = uploadResponse.url;
  //         fileName = uploadResponse.fileName;
  //       }
  //     } catch (uploadError) {
  //       console.warn("Avatar upload failed:", uploadError);
  //     }

  //     // Hash password
  //     const hashedPassword = bcrypt.hashSync(password, salt);

  //     // Create user
  //     const newUser = await prisma.user.create({
  //       data: {
  //         username,
  //         email,
  //         password: hashedPassword,
  //         role,
  //         avatar: avatar,
  //         createdBy: Number(createdBy),
  //         lastUpdatedBy: Number(lastUpdatedBy),
  //       },
  //     });

  //     return new User(newUser);
  //   } catch (error) {
  //     if (fileName) {
  //       try {
  //         const deleteResponse = await upload.deleteFile(fileName);
  //         console.log(`Rolled back uploaded file: ${deleteResponse.fileName}`);
  //       } catch (deleteError) {
  //         console.error("Error rolling back file:", deleteError);
  //       }
  //     }
  //     console.error("User registration error:", error);
  //     throw error;
  //   }
  // }

  // Add more robust error handling
  static async register(data, req, res) {
    let fileName = "";
    try {
      // Validate user data before processing
      const user = new User(data);
      const validationResult = user.validate();

      if (!validationResult.isValid) {
        throw new Error(validationResult.errors.join(", "));
      }

      // More comprehensive file upload with enhanced error handling

      // Transaction for atomic operations
      return await prisma.$transaction(
        async (tx) => {
          // Check unique constraints within transaction
          const [existingUsername, existingEmail] = await Promise.all([
            UserRepository.findByUsername(data.username),
            UserRepository.findByEmail(data.email),
          ]);

          if (existingUsername) {
            throw new Error("Username already exists");
          }

          if (existingEmail) {
            throw new Error("Email already exists");
          }

          const avatar = await upload.uploadFile(req, res, user.username);
          if (avatar) {
            fileName = avatar.fileName;
            user.update({
              avatar: avatar.url,
            });
          }

          // Create user with more detailed error tracking
          const newUser = await tx.user.create({
            data: {
              ...user.toData(),
              // Add audit trail information
              auditTrail: {
                create: {
                  action: "REGISTER",
                  timestamp: new Date(),
                  ipAddress: req.ip,
                },
              },
            },
          });

          console.log(await newUser);
          return new User(newUser);
        },
        {
          maxWait: 5000, // default: 2000
          timeout: 10000, // default: 5000
        }
      );
    } catch (error) {
      if (fileName) {
        try {
          const deleteResponse = await upload.deleteFile(fileName);
          console.warn(`Rolled back uploaded file: ${deleteResponse.fileName}`);
        } catch (deleteError) {
          console.error("Error rolling back file:", deleteError);
        }
      }
      // Centralized error logging
      logError("User Registration", error);
      throw error;
    }
  }

  // Login user
  static async login(credentials) {
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
  static async updateUser(updateData, req, res) {
    let fileName = "";
    try {
      const {
        id,
        username,
        email,
        password,
        avatar,
        role,
        createdBy,
        lastUpdatedBy,
      } = updateData;

      // Check if user exists
      const existingUser = await UserRepository.findById(id);
      if (!existingUser) {
        throw new Error("User not found");
      }

      // Handle avatar upload
      let avatarUrl = avatar;
      try {
        const uploadResponse = await upload.uploadFile(req, res, username);
        if (uploadResponse.status === 200) {
          avatarUrl = uploadResponse.url;
          fileName = uploadResponse.fileName;
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
        where: { id: Number(id) },
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
      if (fileName) {
        try {
          const deleteResponse = await upload.deleteFile(fileName);
          console.log(`Rolled back uploaded file: ${deleteResponse.fileName}`);
        } catch (deleteError) {
          console.error("Error rolling back file:", deleteError);
        }
      }
      console.error("User update error:", error);
      throw error;
    }
  }

  // Delete user
  static async deleteUser(id) {
    try {
      const deletedUser = await prisma.user.delete({
        where: { id: Number(id) },
      });

      return new User(deletedUser);
    } catch (error) {
      console.error(`Error deleting user ${id}:`, error);
      throw error;
    }
  }
}

export default UserService;
