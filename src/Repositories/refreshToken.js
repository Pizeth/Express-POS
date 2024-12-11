// Repositories/refreshToken.js
import prisma from "../Configs/connect.js";
export class RefreshTokenRepository {
  // Check if refresh token exists in database
  static async findToken(token) {
    try {
      return prisma.refreshToken.findUnique({
        where: { token: token },
        include: { user: true },
      });
    } catch (error) {
      console.error("Error fetching refresh token:", error);
      throw error;
    }
  }

  // Remove refresh token from database
  static async removeTokens(token) {
    try {
      return prisma.refreshToken.deleteMany({
        where: { token: token },
      });
    } catch (error) {
      console.error("Error deleting refresh token:", error);
      throw error;
    }
  }

  // Save refresh token to database
  static async createRefreshToken(token, id) {
    try {
      return prisma.refreshToken.create({
        data: {
          token: token,
          userId: id,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        },
      });
    } catch (error) {
      console.error("Error saving refresh token:", error);
      throw error;
    }
  }
}

export default RefreshTokenRepository;
