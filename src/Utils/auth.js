import prisma from "../Configs/connect.js";
import jwt from "jsonwebtoken";
import repo from "../Repository/user.js";
import { error } from "console";
const secretKey = process.env.SECRET_KEY || 270400;
const refreshTokenKey = process.env.REFRESH_TOKEN_KEY || 270400;

export class Auth {
  // Utility for authentication token generation
  static generateAccessToken(payload) {
    return jwt.sign(payload, secretKey, { expiresIn: "7d" });
  }

  static generateRefreshToken(payload) {
    return jwt.sign(payload, refreshTokenKey, { expiresIn: "7d" });
  }

  // Refresh Token Management
  static async createRefreshToken(payload) {
    const refreshToken = generateRefreshToken(payload);
    // Store refresh token in database
    await prisma.refreshToken.create({
      data: payload,
    });
    return refreshToken;
  }

  // Refresh Access Token
  static async refreshAccessToken(refreshToken, req) {
    try {
      // Check if token exists in database and is not expired
      const storedToken = await prisma.refreshToken.findUnique({
        where: { token: refreshToken },
      });

      if (!storedToken || storedToken.expiresAt < new Date()) {
        throw new Error("Invalid or expired refresh token!");
      }

      const user = await prisma.user.findUnique({
        where: { id: storedToken.userId },
      });

      if (!user) {
        throw new Error("invalid refresh token!");
      }

      // Generate new access token
      const accessToken = generateAccessToken({
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        ip: req.ip,
      });

      return accessToken;
    } catch (error) {
      // Remove invalid refresh token
      await prisma.refreshToken.deleteMany({
        where: { token: refreshToken },
      });

      throw error;
    }
  }

  // Logout and Invalidate Tokens
  static async logout(userId, refreshToken) {
    // Delete specific refresh token
    await prisma.refreshToken.deleteMany({
      where: {
        userId,
        token: refreshToken,
      },
    });

    // // Optional: Log logout event
    // await createAuditTrail({
    //   userId,
    //   action: "LOGOUT",
    //   category: "AUTHENTICATION",
    // });
  }
}

export default Auth;
