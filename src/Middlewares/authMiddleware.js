// File: src/middleware/authMiddleware.js
import { error } from "../Utils/form.js";
// import jwt from "jsonwebtoken";
import tonkenManager from "../Utils/tokenManager.js";

// const secretKey = process.env.SECRET_KEY || 270400;

// const validateUser = (req, res, next) => {
//   jwt.verify(req.headers["x-access-token"], secretKey, (err, decoded) => {
//     if (err) {
//       error(res, err.message);
//     } else {
//       req.body.user_id = decoded.id;
//       next();
//     }
//   });
// };

export const authMiddleware = (req, res, next) => {
  // Get the token from the Authorization header
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return error(res, 401, "No token provided");
  }

  // Extract the token (assuming "Bearer TOKEN" format)
  // console.log(authHeader);
  const token = authHeader.split(" ")[1];

  try {
    // Verify the token
    const decoded = tonkenManager.verifyTokenClaims(token, req);
    console.log(decoded);
    // const decoded = jwt.verify(token, secretKey);

    // Attach user information to the request
    // req.user = {
    //   id: decoded.id,
    //   username: decoded.username,
    //   email: decoded.email,
    //   role: decoded.role,
    //   ip: req.ip,
    // };

    req.user = decoded;

    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return error(res, 401, "Token expired");
    }
    return error(res, 403, "Failed to authenticate token");
  }
};

// Role-based authorization middleware
export const roleMiddleware = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      error(res, 401, "Authentication required");
      //   return res.status(401).json({ message: "Authentication required" });
    }

    // Check if the user's role is in the allowed roles
    if (!roles.includes(req.user.role)) {
      error(res, 401, "Access denied");
      //   return res.status(403).json({ message: "Access denied" });
    }
    next();
  };

  //   return (req, res, next) => {
  //     if (!req.user) {
  //       return res.status(401).json({ message: "Authentication required" });
  //     }

  //     // Check if the user's role is in the allowed roles
  //     if (!roles.includes(req.user.role)) {
  //       return res.status(403).json({
  //         message: "Access denied",
  //         userRole: req.user.role,
  //         allowedRoles,
  //       });
  //     }

  //     next();
  //   };
};

export default {
  authMiddleware,
  roleMiddleware,
};
