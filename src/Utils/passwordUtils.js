import bcrypt from "bcrypt";

export class PasswordUtils {
  // Password hashing method
  static hash(password, salt) {
    return bcrypt.hashSync(password, salt);
  }

  // Password compare method
  static compare(password, userPassword) {
    return bcrypt.compareSync(password, userPassword);
  }

  // Salt generating method
  static getSalt() {
    return bcrypt.genSaltSync(Number(process.env.SALT));
  }
}

export default PasswordUtils;

// File: src/routes/authRoutes.js
const express = require("express");
const AuthService = require("../services/authService");
const { body, validationResult } = require("express-validator");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Validation middleware
const registerValidation = [
  body("username")
    .isLength({ min: 3 })
    .withMessage("Username must be at least 3 characters long")
    .trim()
    .escape(),
  body("email").isEmail().withMessage("Invalid email address").normalizeEmail(),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .matches(/\d/)
    .withMessage("Password must contain a number")
    .matches(/[A-Z]/)
    .withMessage("Password must contain an uppercase letter")
    .matches(/[a-z]/)
    .withMessage("Password must contain a lowercase letter")
    .matches(/[!@#$%^&*(),.?":{}|<>]/)
    .withMessage("Password must contain a special character"),
];

// Register Route
router.post("/register", registerValidation, async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password, profile } = req.body;

    const user = await AuthService.register({
      username,
      email,
      password,
      profile,
    });

    res.status(201).json({
      message: "User registered successfully",
      userId: user.id,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(400).json({
      message: error.message || "Registration failed",
    });
  }
});

// Login Route
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const authResult = await AuthService.login(username, password);

    // Set refresh token as HTTP-only cookie
    res.cookie("refreshToken", authResult.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json({
      accessToken: authResult.accessToken,
      user: authResult.user,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(401).json({
      message: error.message || "Login failed",
    });
  }
});

// Refresh Token Route
router.post("/refresh-token", async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    const { accessToken } = await AuthService.refreshToken(refreshToken);

    res.json({ accessToken });
  } catch (error) {
    console.error("Refresh token error:", error);
    res.status(401).json({
      message: error.message || "Token refresh failed",
    });
  }
});

// Logout Route
router.post("/logout", authMiddleware, async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    await AuthService.logout(refreshToken);

    // Clear refresh token cookie
    res.clearCookie("refreshToken");

    res.json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(400).json({
      message: error.message || "Logout failed",
    });
  }
});

module.exports = router;
