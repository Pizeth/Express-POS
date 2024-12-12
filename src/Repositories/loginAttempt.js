// Repositories/loginAttempt.js
import prisma from "../Configs/connect.js";
export class LoginAttemptRepository {
  // Login Attempt Tracking
  static async recordLoginAttempt(user, req, status) {
    const ipAddress = req.ip;
    const userAgent = req.headers["user-agent"];
    // const il = !id ? null : id;
    // console.log(il);
    try {
      return prisma.loginAttempt.create({
        data: {
          userId: !user.id ? null : user.id,
          username: !user.username ? user : user.username,
          ipAddress,
          userAgent,
          status,
        },
      });
    } catch (error) {
      console.error("Error recording user login attempts:", error);
      throw error;
    }
  }
}

export default LoginAttemptRepository;
