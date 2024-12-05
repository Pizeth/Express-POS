// services/authService.js
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { RateLimiterMemory } from "rate-limiter-flexible";

export class AuthService {
  // Configurable rate limiter for login attempts
  static loginLimiter = new RateLimiterMemory({
    points: 5, // 5 attempts
    duration: 60 * 15, // 15 minutes
  });

  // Generate secure tokens
  static generateTokens(user) {
    const accessToken = jwt.sign(
      {
        id: user.id,
        role: user.role,
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "15m",
      }
    );

    const refreshToken = jwt.sign(
      {
        id: user.id,
      },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: "7d",
      }
    );

    return { accessToken, refreshToken };
  }

  // Implement multi-factor authentication
  static async generateMFASecret() {
    return {
      secret: crypto.randomBytes(32).toString("hex"),
      qrCode: await this.generateQRCode(), // Use library like speakeasy
    };
  }

  // Advanced login with multiple security checks
  static async login(username, password) {
    try {
      // Rate limit login attempts
      await this.loginLimiter.consume(username);

      // Find user
      const user = await UserRepository.findByUsername(username);
      if (!user) {
        throw new Error("Invalid credentials");
      }

      // Check if account is locked
      if (user.loginAttempts >= 5) {
        const lockoutTime = user.lastLoginAttempt.getTime() + 15 * 60 * 1000;
        if (Date.now() < lockoutTime) {
          throw new Error("Account temporarily locked. Try again later.");
        }
      }

      // Verify password
      const isPasswordValid = await this.verifyPassword(
        password,
        user.password
      );
      if (!isPasswordValid) {
        // Increment failed login attempts
        await UserRepository.incrementLoginAttempts(user.id);
        throw new Error("Invalid credentials");
      }

      // Reset login attempts on successful login
      await UserRepository.resetLoginAttempts(user.id);

      // Generate tokens
      const { accessToken, refreshToken } = this.generateTokens(user);

      return {
        user: user.toJSON(),
        tokens: { accessToken, refreshToken },
      };
    } catch (error) {
      this.logAuthFailure(username, error);
      throw error;
    }
  }

  // Secure password verification
  static async verifyPassword(inputPassword, storedHash) {
    return new Promise((resolve, reject) => {
      // Use memory-hard hashing algorithm (Argon2)
      argon2.verify(storedHash, inputPassword).then(resolve).catch(reject);
    });
  }

  // Logging authentication failures
  static logAuthFailure(username, error) {
    // Consider using a secure logging service
    console.error(`Auth Failure for ${username}:`, {
      message: error.message,
      timestamp: new Date().toISOString(),
      ip: this.getCurrentIP(), // Implement method to get current IP
    });
  }

  // Token validation middleware
  static validateToken(req, res, next) {
    const token = req.headers["authorization"]?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    try {
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

      // Additional token validation
      if (decoded.exp < Date.now() / 1000) {
        return res.status(401).json({ error: "Token expired" });
      }

      req.user = decoded;
      next();
    } catch (error) {
      return res.status(401).json({ error: "Invalid token" });
    }
  }

  // Refresh token mechanism
  static async refreshAccessToken(refreshToken) {
    try {
      const decoded = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET
      );

      // Fetch user and validate refresh token
      const user = await UserRepository.findById(decoded.id);

      if (!user) {
        throw new Error("User not found");
      }

      // Generate new access token
      return this.generateTokens(user).accessToken;
    } catch (error) {
      throw new Error("Invalid refresh token");
    }
  }
}
