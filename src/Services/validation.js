import userRepo from "../Repositories/user.js";
// import { AppError, clientResponse } from "../Utils/responseHandler.js";
import statusCode from "http-status-codes";

export class ValidationService {
  static async validateUsername(username) {
    try {
      const result = await userRepo.findByUsername(username);
      // if (!result) {
      //   throw new AppError(`${username} is available.`, statusCode.OK, result);
      // }
      return result;
    } catch (error) {
      throw error;
    }
  }

  static async validateEmail(email, res) {
    try {
      const result = await userRepo.findByEmail(email);
      // if (!result) {
      //   throw new AppError(`${email} is available.`, statusCode.OK, result);
      // }
      return result;
    } catch (error) {
      throw error;
    }
  }
}

export default ValidationService;
