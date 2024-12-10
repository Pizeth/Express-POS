import jwt from "jsonwebtoken";
const secretKey = process.env.SECRET_KEY || 270400;
const refreshTokenKey = process.env.REFRESH_TOKEN_KEY || 200794;

// Utility for authentication token generation
export class TokenManager {
  // Generate tokens
  static generateAccessToken(payload) {
    return jwt.sign(payload, secretKey, { expiresIn: "900s" });
  }

  // Generate refresh tokens
  static generateRefreshToken(payload) {
    return jwt.sign(payload, refreshTokenKey, { expiresIn: "7d" });
  }

  // Verify refresh token
  static verifyToken(refreshToken) {
    return jwt.verify(refreshToken, refreshTokenKey);
  }

  static verifyMFAToken() {}
}

export default TokenManager;
