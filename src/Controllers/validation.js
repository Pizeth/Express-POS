import service from "../Services/validation.js";
import { clientResponse } from "../Utils/responseHandler.js";
import statusCode from "http-status-codes";
import axios from "axios";

const MAIL_VERIFY_KEY = process.env.MAIL_VERIFY_KEY;

export class Validation {
  static async getUsername(req, res, next) {
    try {
      const { username } = req.params;
      const result = await service.validateUsername(username);
      if (!result) {
        return clientResponse(
          res,
          statusCode.OK,
          result,
          `${username} is available.`
        );
      }
      return clientResponse(
        res,
        statusCode.ACCEPTED,
        result,
        `${username} is already exists!.`
      );
    } catch (error) {
      next(error);
    }
  }

  static async getEmail(req, res, next) {
    try {
      const { email } = req.params;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return clientResponse(
          res,
          statusCode.ACCEPTED,
          null,
          "Invalid email format!"
        );
      }
      // const response = await axios.get(
      //   `https://api.verifyemailaddress.org/api/v1?email=${email}&apikey=${MAIL_VERIFY_KEY}`
      // );
      // const { status, info } = response.data;
      const {
        data: { status, info },
      } = await axios.get(
        `https://api.verifyemailaddress.org/api/v1?email=${email}&apikey=${MAIL_VERIFY_KEY}`
      );

      if (status !== "valid") {
        return clientResponse(
          res,
          statusCode.ACCEPTED,
          null,
          `Email verification failed: ${info}`
        );
      }

      // const result = await service.validateEmail(email);
      // if (!result) {
      //   return clientResponse(
      //     res,
      //     statusCode.OK,
      //     result,
      //     `${email} is available.`
      //   );
      // }
      // return clientResponse(
      //   res,
      //   statusCode.ACCEPTED,
      //   result,
      //   `${email} is already exists!.`
      // );
      const result = await service.validateEmail(email);
      const message = result
        ? `${email} already exists!`
        : `${email} is available.`;
      const responseStatus = result ? statusCode.ACCEPTED : statusCode.OK;

      return clientResponse(res, responseStatus, result, message);
    } catch (error) {
      next(error);
    }
  }
}

export default Validation;

// export const getUsername = async (req, res, next) => {
//   try {
//     const { username } = req.params;
//     const result = await service.validateUsername(username);
//     if (!result) {
//       return clientResponse(
//         res,
//         statusCode.OK,
//         result,
//         `${username} is available.`
//       );
//     }
//     return clientResponse(
//       res,
//       statusCode.ACCEPTED,
//       result,
//       `${username} is already exists!.`
//     );
//   } catch (error) {
//     next(error);
//   }
// };

// export const getEmail = async (req, res, next) => {
//   try {
//     const { email } = req.params;
//     const result = await repo.validateEmail(email);
//     if (!result) {
//       return clientResponse(
//         res,
//         statusCode.OK,
//         result,
//         `${email} is available.`
//       );
//     }
//     return clientResponse(
//       res,
//       statusCode.ACCEPTED,
//       result,
//       `${email} is already exists!.`
//     );
//   } catch (error) {
//     next(error);
//   }
// };
