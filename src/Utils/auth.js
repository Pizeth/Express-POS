import jwt from "jsonwebtoken";
const secretKey = process.env.SECRET_KEY || 270400;

export class Auth {
  // Utility for authentication token generation
  static generateToken(payload) {
    return jwt.sign(payload, secretKey, {
      expiresIn: "7d",
    });
  }
}

export default Auth;
