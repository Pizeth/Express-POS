/**
 * Validation Controller
 * Handles validation of usernames and emails.
 */

import service from "../Services/validation.js";
import { verifyEmail } from "@devmehq/email-validator-js";
import { clientResponse } from "../Utils/responseHandler.js";
import statusCode from "http-status-codes";
import validator from "validator";

export class Validation {
  /**
   * Validates the availability of a username.
   * @param {Object} req - Express request object.
   * @param {Object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   * @returns {Promise<void>}
   */
  static async getUsername(req, res, next) {
    try {
      const { username } = req.params;

      if (!username || username.length < 5) {
        const message = !username
          ? "Username cannot be empty!"
          : "Username must be at least 5 characters!";
        return clientResponse(res, statusCode.ACCEPTED, null, message);
      }
      const usernameRegex =
        /^(?=.{5,50}$)[a-zA-Z](?!.*([_.])\1)[a-zA-Z0-9_.]*$/;
      if (!usernameRegex.test(username)) {
        return clientResponse(
          res,
          statusCode.ACCEPTED,
          null,
          "Invalid username format! Ensure it Starts with a letter Is 5-50 characters long Only uses letters, numbers, _, or ., No consecutive __ or .."
        );
      }

      // const result = await service.validateUsername(username);
      // if (!result) {
      //   return clientResponse(
      //     res,
      //     statusCode.OK,
      //     result,
      //     `${username} is available.`
      //   );
      // }
      // return clientResponse(
      //   res,
      //   statusCode.ACCEPTED,
      //   result,
      //   `${username} is already exists!.`
      // );

      const result = await service.validateUsername(username);
      return clientResponse(
        res,
        result ? statusCode.ACCEPTED : statusCode.OK,
        result,
        result ? `${username} already exists!.` : `${username} is available.`
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Validates the format and availability of an email.
   * @param {Object} req - Express request object.
   * @param {Object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   * @returns {Promise<void>}
   */
  static async getEmail(req, res, next) {
    try {
      const { email } = req.params;
      if (!validator.isEmail(email)) {
        return clientResponse(
          res,
          statusCode.ACCEPTED,
          null,
          "Invalid email format!"
        );
      }

      const { validFormat, validMx, validSmtp } = await verifyEmail({
        emailAddress: email,
        verifyMx: true,
        verifySmtp: true,
        timeout: 3000,
      });
      console.log(validFormat);
      console.log(validMx);
      console.log(validSmtp);

      if (!validFormat || !validMx || !validSmtp) {
        return clientResponse(
          res,
          statusCode.ACCEPTED,
          null,
          `Email ${email} is invalid!`
        );
      }

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
