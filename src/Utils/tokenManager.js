import jwt from "jsonwebtoken";
import TokenRepo from "../Repositories/refreshToken.js";
const secretKey = process.env.SECRET_KEY || 270400;
const refreshTokenKey = process.env.REFRESH_TOKEN_KEY || 200794;

// Utility for authentication token generation
export class TokenManager {
  static generatePayload(user, req) {
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      ip: req.ip,
    };
  }
  // Generate tokens
  static generateAccessToken(payload) {
    return jwt.sign(payload, secretKey, { expiresIn: "900s" });
  }

  // Generate refresh tokens
  static async generateRefreshToken(payload) {
    const token = jwt.sign(payload, refreshTokenKey, { expiresIn: "7d" });
    try {
      return TokenRepo.createRefreshToken(token, payload.id);
    } catch (error) {
      console.error("Error saving refresh token:", error);
      throw error;
    }
  }

  // Get the refresh token from database
  static async getToken(token) {
    try {
      return TokenRepo.findToken(token);
    } catch (error) {
      console.error("Error saving fetching token:", error);
      throw error;
    }
  }

  static async remove(token) {
    try {
      return TokenRepo.removeTokens(token);
    } catch (error) {
      console.error("Error saving deleting token:", error);
      throw error;
    }
  }

  // Verify refresh token
  static verifyToken(refreshToken) {
    return jwt.verify(refreshToken, refreshTokenKey);
  }

  static async verifyToken(refreshToken) {
    return jwt.verify(refreshToken, refreshTokenKey);
  }

  static verifyMFAToken() {}
}

export default TokenManager;
