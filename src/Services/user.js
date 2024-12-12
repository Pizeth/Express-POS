// services/userService.js
import prisma from "../Configs/connect.js";
import model from "../Models/user.js";
import UserRepo from "../Repositories/user.js";
import upload from "../Services/fileUpload.js";
import { logError } from "../Utils/form.js";
import loginRepo from "../Repositories/loginAttempt.js";
import tokenManager from "../Utils/tokenManager.js";
import passwordUtils from "../Utils/passwordUtils.js";

export class UserService {
  // Register a new user
  static async register(data, req, res) {
    let fileName = "";
    try {
      // Validate user data before processing
      const user = new model.User(data);
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
          if (avatar && avatar.status === 200) {
            fileName = avatar.fileName;
            user.update({
              avatar: avatar.url,
            });
          }

          // Create user with more detailed error tracking
          const newUser = await tx.user.create({
            data: {
              ...user.toNew(),
              password: passwordUtils.hash(data.password),
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
          return new model.User(newUser);
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
      const { username, password } = model.LoginSchema.parse(credentials);

      // Find user by username or email
      const user = await UserRepo.findUser(username);

      // Check if user existed
      if (!user) {
        await loginRepo.recordLoginAttempt(username, req, "FAILED");
        throw new Error("User not found!");
      }

      // Check if user is banned or deleted
      if (user.isBan || !user.enabledFlag) {
        await loginRepo.recordLoginAttempt(user, req, "FAILED");
        throw new Error("Account is banned or inactive!");
      }

      // Check if user is locked
      if (user.isLocked) {
        await loginRepo.recordLoginAttempt(user, req, "FAILED");
        throw new Error("Account locked due to multiple failed attempts!");
      } else if (user.loginAttempts >= 5) {
        // If the user has 5 attempts or more then lock this user
        await UserRepo.updateUserStatus(user.id, { isLocked: true });
        await loginRepo.recordLoginAttempt(user, req, "FAILED");
        throw new Error("Too many failed attempts, account is locked!");
      }

      // Verify password
      const isPasswordValid = user.verifyPassword(password);

      if (!isPasswordValid) {
        // Increment login attempts
        await UserRepo.incrementLoginAttempts(user.toData());
        await loginRepo.recordLoginAttempt(user, req, "FAILED");
        throw new Error("Invalid credentials");
      }

      // Reset login attempts on successful login
      await UserRepo.resetLoginAttempts(user.id);

      // Record successful login attempt and update last login
      await loginRepo.recordLoginAttempt(user, req, "SUCCESS");

      // Generate payload to use for create token
      const payload = tokenManager.generatePayload(user, req);

      // Generate authentication token
      const token = tokenManager.generateAccessToken(payload);

      // Save refresh token to database
      const refreshToken = await tokenManager.generateRefreshToken(payload);

      return {
        data: new model.User(user.toData()),
        token: token,
        refreshToken: refreshToken.token,
      };
    } catch (error) {
      logError("User login error:", error, req);
      throw error;
    }
  }

  // Audit Trail Methods
  static async createAuditTrail(
    userId,
    action,
    description,
    ipAddress,
    category = null
  ) {
    return prisma.auditTrail.create({
      data: {
        userId,
        action,
        description,
        ipAddress,
        category: category ? { connect: { id: category } } : undefined,
      },
    });
  }

  // Password Reset Workflow
  static async initiatePasswordReset(email) {
    const user = await UserRepository.findByEmail(email);
    if (!user) throw new Error("User not found");

    // Generate a unique password reset token
    const resetToken = uuidv4();
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

    // Store reset token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordResetToken: resetToken,
        passwordResetExpiry: resetTokenExpiry,
      },
    });

    // TODO: Send email with reset link
    // This would typically involve an email service
    return { resetToken };
  }

  static async completePasswordReset(resetToken, newPassword) {
    const user = await prisma.user.findFirst({
      where: {
        passwordResetToken: resetToken,
        passwordResetExpiry: { gt: new Date() },
      },
    });

    if (!user) throw new Error("Invalid or expired reset token");

    // Update user password and clear reset token
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        password: bcrypt.hashSync(newPassword, 12),
        passwordResetToken: null,
        passwordResetExpiry: null,
      },
    });

    return new model.User(updatedUser);
  }

  // Refresh Token
  static async refreshToken(refreshToken, req) {
    try {
      if (!refreshToken) {
        throw new Error("Refresh token is required");
      }
      // Verify refresh token
      const decoded = tokenManager.verifyToken(refreshToken);

      if (!decoded) {
        throw new Error("Invalid refresh token");
      }

      // Check if refresh token exists in database
      const storedToken = await tokenManager.getToken(refreshToken);

      if (!storedToken || storedToken.expiresAt < new Date()) {
        throw new Error("Invalid or expired refresh token!");
      }

      // Generate payload to use for create token
      const payload = tokenManager.generatePayload(storedToken.user, req);
      // Generate new access token
      return tokenManager.generateAccessToken(payload);
    } catch (error) {
      // Remove invalid refresh token
      await tokenManager.remove(refreshToken);
      logError("User refresh token error:", error, req);
      throw new Error("Invalid refresh token");
    }
  }

  // Update user
  static async updateUser(data, req) {
    let fileName = "";
    try {
      const user = model.UpdateSchema.parse(data);

      // Transaction for atomic operations
      return await prisma.$transaction(
        async (tx) => {
          // Check unique constraints within transaction
          const existingUser = await UserRepo.findById(user.id);

          // Check if the user existed
          if (!existingUser) {
            throw new Error("User not found");
          }

          const avatar = await upload.uploadFile(req, existingUser.username);
          fileName = avatar && avatar.status === 400 ? "" : avatar.fileName;

          // Create user with more detailed error tracking
          const newUser = await tx.user.update({
            where: { id: user.id },
            data: {
              ...user,
              avatar:
                avatar && avatar.status === 200
                  ? avatar.url
                  : existingUser.avatar,
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
          return new model.User(newUser);
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
          console.log(`Rolled back uploaded file: ${deleteResponse.fileName}`);
        } catch (deleteError) {
          console.error("Error rolling back file:", deleteError);
        }
      }
      // Centralized error logging
      logError("User Update", error, req);
      throw error;
    }
  }

  // Delete user
  static async deleteUser(id) {
    try {
      const deletedUser = await prisma.user.delete({
        where: { id: Number(id) },
      });

      return new model.User(deletedUser);
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
