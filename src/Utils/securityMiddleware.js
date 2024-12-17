// middleware/securityMiddleware.js
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { AuthService } from "../Services/authService.js";

export class SecurityMiddleware {
  // Comprehensive security middleware
  static configure(app) {
    // Helmet for setting various HTTP headers
    app.use(
      helmet({
        contentSecurityPolicy: {
          directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", "data:", "https:"],
          },
        },
      })
    );

    // Global rate limiting
    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
      message: "Too many requests, please try again later",
    });
    app.use(limiter);

    // CORS configuration
    app.use((req, res, next) => {
      res.header("Access-Control-Allow-Origin", process.env.ALLOWED_ORIGIN);
      res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
      res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
      next();
    });

    // Token validation middleware for protected routes
    app.use("/api/protected", AuthService.validateToken);
  }
}
