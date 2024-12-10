// services/userService.js
import prisma from "../Configs/connect.js";
import User from "../Models/user.js";
import UserRepo from "../Repository/user.js";
import upload from "../Services/fileUpload.js";
import { logError } from "../Utils/form.js";
import passwordUtils from "../Utils/passwordUtils.js";
import tokenManager from "../Utils/tokenManager.js";

export class UserService {
  // Register a new user
  static async register(data, req, res) {
    let fileName = "";
    try {
      // Validate user data before processing
      const user = new User(data);
      const validationResult = user.validate();

      if (!validationResult.isValid) {
        throw new Error(validationResult.errors.join(", "));
      }

      // Transaction for atomic operations
      return await prisma.$transaction(
        async (tx) => {
          // Check unique constraints within transaction
          const [existingUsername, existingEmail] = await Promise.all([
            UserRepo.findByUsername(data.username),
            UserRepo.findByEmail(data.email),
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
              ...user.toNew(),
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
      logError("User Registration", error, req);
      throw error;
    }
  }

  // Login user
  static async login(credentials, req) {
    try {
      const { username, password } = credentials;

      // Find user by username or email
      const user = await UserRepo.findUser(username);

      // Check if user existed
      if (!user) {
        throw new Error("User not found!");
      }

      // Check if user is locked or banned
      if (user.isLocked || user.isBan) {
        throw new Error("Account is locked or banned");
      }

      // Verify password
      // const isPasswordValid = passwordUtils.compare(password, user.password);
      const isPasswordValid = user.verifyPassword(password);

      if (!isPasswordValid) {
        // Increment login attempts
        await prisma.user.update({
          where: { id: user.id },
          data: {
            loginAttempts: { increment: 1 },
            isLocked: user.loginAttempts >= 5, // Lock after 5 failed attempts
          },
        });
        throw new Error("Invalid credentials!");
      }

      // Reset login attempts on successful login
      await prisma.user.update({
        where: { id: user.id },
        data: {
          loginAttempts: 0,
          lastLogin: new Date(),
          isLocked: false,
        },
      });

      const payload = {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        ip: req.ip,
      };

      // Generate authentication token
      const token = tokenManager.generateAccessToken(payload, req);
      const refreshToken = tokenManager.generateRefreshToken(payload, req);

      // Save refresh token to database
      await prisma.refreshToken.create({
        data: {
          token: refreshToken,
          userId: user.id,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        },
      });

      return {
        data: new User(user.toData()),
        token: token,
        refreshToken: refreshToken,
      };
    } catch (error) {
      logError("User login error:", error, req);
      throw error;
    }
  }

  // Refresh Token
  static async refreshToken(refreshToken, req) {
    if (!refreshToken) {
      throw new Error("Refresh token is required");
    }

    try {
      // Verify refresh token
      const decoded = this.verifyToken(refreshToken);

      if (!decoded) {
        throw new Error("Invalid refresh token");
      }

      // Check if refresh token exists in database
      const storedToken = await prisma.refreshToken.findUnique({
        where: { token: refreshToken },
        include: { user: true },
      });

      if (!storedToken || storedToken.expiresAt < new Date()) {
        throw new Error("Invalid or expired refresh token!");
      }

      const payload = {
        id: storedToken.user.id,
        username: storedToken.user.username,
        email: storedToken.user.email,
        role: storedToken.user.role,
        ip: req.ip,
      };
      // Generate new access token
      const accessToken = this.generateAccessToken(payload);

      return accessToken;
    } catch (error) {
      // Remove invalid refresh token
      await prisma.refreshToken.deleteMany({
        where: { token: refreshToken },
      });
      throw new Error("Invalid refresh token");
    }
  }

  // Update user
  static async updateUser(data, req, res) {
    let fileName = "";
    try {
      // Validate user data before processing
      const user = new User(data);
      const validationResult = user.validate();

      if (!validationResult.isValid) {
        throw new Error(validationResult.errors.join(", "));
      }

      // Transaction for atomic operations
      return await prisma.$transaction(
        async (tx) => {
          // Check unique constraints within transaction
          const [existingUser, existingUsername, existingEmail] =
            await Promise.all([
              UserRepo.findById(data.id),
              UserRepo.findByUsername(data.username),
              UserRepo.findByEmail(data.email),
            ]);

          if (!existingUser) {
            throw new Error("User not found");
          }

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
          } else {
            uuser.update({
              avatar: existingUser.avatar,
            });
          }

          // Create user with more detailed error tracking
          const newUser = await tx.user.update({
            data: {
              ...user.toData(),
              // Add audit trail information
              auditTrail: {
                create: {
                  action: "UPDATE",
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

      // // Check if user exists
      // const existingUser = await UserRepository.findById(id);
      // if (!existingUser) {
      //   throw new Error("User not found");
      // }

      // // Handle avatar upload
      // let avatarUrl = avatar;
      // try {
      //   const uploadResponse = await upload.uploadFile(req, res, username);
      //   if (uploadResponse.status === 200) {
      //     avatarUrl = uploadResponse.url;
      //     fileName = uploadResponse.fileName;
      //   }
      // } catch (uploadError) {
      //   console.warn("Avatar upload failed:", uploadError);
      // }

      // // Hash password if provided
      // const hashedPassword = password
      //   ? bcrypt.hashSync(password, salt)
      //   : undefined;

      // // Update user
      // const updatedUser = await prisma.user.update({
      //   where: { id: Number(id) },
      //   data: {
      //     username,
      //     email,
      //     ...(hashedPassword && { password: hashedPassword }),
      //     avatar: avatarUrl,
      //     role,
      //     createdBy: Number(createdBy),
      //     lastUpdatedBy: Number(lastUpdatedBy),
      //     objectVersionId: { increment: 1 },
      //   },
      // });

      // return new User(updatedUser);
    } catch (error) {
      if (fileName) {
        try {
          const deleteResponse = await upload.deleteFile(fileName);
          console.log(`Rolled back uploaded file: ${deleteResponse.fileName}`);
        } catch (deleteError) {
          console.error("Error rolling back file:", deleteError);
        }
      }
      // Centralized error logging
      logError("User Registration", error, req);
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
