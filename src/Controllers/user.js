// import model from "../Models/user.js";
import service from "../Services/user.js";
import repo from "../Repositories/user.js";
import { success, error } from "../Utils/form.js";
import { AppError, clientResponse } from "../Utils/responseHandler.js";
import statusCode from "http-status-codes";
import { response } from "express";

export const getUser = (req, res) => {
  // const page = fPagination(req);
  const param = req.param;
  repo
    .findUsers(param.page, param.pageSize, param.orderBy, param.orderDirection)
    .then((response) => {
      success(res, 200, response);
    })
    .catch((err) => {
      console.log(err);
      error(res, 400, err);
    });
};

export const getUserId = (req, res) => {
  repo
    .findById(req.params.id)
    .then((response) => {
      if (response) {
        success(res, 200, response);
      } else {
        error(res, 400, "User not found!");
      }
    })
    .catch((err) => {
      error(res, 400, err);
    });
};

export const getUsername = (req, res) => {
  repo
    .findByUsername(req.params.username)
    .then((response) => {
      if (response) {
        success(res, 400, response.username + " is already exists!");
      } else {
        error(res, 200, "Available");
      }
    })
    .catch((err) => {
      error(res, 400, err);
    });
};

export const getEmail = (req, res) => {
  repo
    .findByEmail(req.params.email)
    .then((response) => {
      console.log(response);
      if (response) {
        success(res, 400, response.email + " is already exists!");
      } else {
        error(res, 200, "Available");
      }
    })
    .catch((err) => {
      error(res, 400, err);
    });
};

export const registerUser = async (req, res) => {
  try {
    const param = req.body;

    // Validate required fields
    if (!param.username) {
      return error(res, 400, "Username can't be empty");
    }
    if (!param.password) {
      return error(res, 400, "Password can't be empty");
    }

    // Call the model function and await its response
    const response = await service.register(param, req, res);

    // Send success response
    return success(res, 200, `User ${response.username} created successfully`);
  } catch (err) {
    console.error("Error in registerUser controller:", err);
    return error(res, 400, err.message || "Registration failed");
  }
};

export const putUser = async (req, res, next) => {
  const param = req.body;
  service
    .updateUser(param, req, res)
    .then((response) => {
      clientResponse(
        res,
        statusCode.OK,
        response,
        "User " + response.username + " updated successfully"
      );
    })
    .catch((err) => {
      next(err);
    });
};

export const changePassword = (req, res, next) => {
  const param = req.body;
  service
    .updatePassword(param, req)
    .then((response) => {
      clientResponse(
        res,
        statusCode.OK,
        response,
        "Password changed successfully"
      );
    })
    .catch((err) => {
      next(err);
    });
};

export const loginUser = async (req, res, next) => {
  try {
    const param = req.body;
    if (!param.username) {
      throw new AppError(
        "Username can't be empty",
        statusCode.UNPROCESSABLE_ENTITY,
        { field: "username", expected: "not null", received: "null" }
      );
    }
    if (!param.password) {
      throw new AppError(
        "Password can't be empty",
        statusCode.UNPROCESSABLE_ENTITY,
        { field: "password", expected: "not null", received: "null" }
      );
    }
    const response = await service.login(param, req);

    if (!response) {
      throw new AppError(
        "Password can't be empty",
        statusCode.UNPROCESSABLE_ENTITY,
        res
      );
    }

    // Set refresh token as HTTP-only cookie
    res.cookie("refreshToken", response.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    clientResponse(
      res,
      statusCode.OK,
      {
        user_id: response.data.id,
        username: response.data.username,
        email: response.data.email,
        role: response.data.role,
        avatar: response.data.avatar,
        token: response.token,
        refreshToken: response.refreshToken,
      },
      "Login success!"
    );
  } catch (error) {
    next(error);
  }

  // service
  //   .login(param, req)
  //   .then((response) => {
  //     if (response) {
  //       // Set refresh token as HTTP-only cookie
  //       res.cookie("refreshToken", response.refreshToken, {
  //         httpOnly: true,
  //         secure: process.env.NODE_ENV === "production",
  //         sameSite: "strict",
  //         maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  //       });

  //       success(res, 200, {
  //         user_id: response.data.id,
  //         username: response.data.username,
  //         email: response.data.email,
  //         role: response.data.role,
  //         avatar: response.data.avatar,
  //         token: response.token,
  //         refreshToken: response.refreshToken,
  //       });
  //     } else {
  //       error(res, 400, "User not found");
  //     }
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //     error(res, 400, err);
  //   });
};

export const getRefreshToken = (req, res) => {
  // console.log(req);
  // const refreshToken = req.cookies.refreshToken;
  const refreshToken = req.headers["refresh-token"];
  service
    .refreshToken(refreshToken, req)
    .then((response) => {
      success(res, 200, response);
    })
    .catch((err) => {
      console.error("Refresh token error:", err);
      error(res, 401, err);
    });
};

export const deleteUser = (req, res) => {
  const id = req.param.id;
  repo
    .findById(id)
    .then((response) => {
      if (response) {
        service
          .deleteUser(id)
          .then((response) => {
            success(res, 200, "Username " + response.name + " success delete");
          })
          .catch((err) => {
            error(res, 400, err);
          });
      } else {
        error(res, 400, "User Not Found");
      }
    })
    .catch((err) => {
      error(res, 400, err);
    });
};

export const logout = (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  service
    .logout(refreshToken)
    .then((response) => {
      // Clear refresh token cookie
      res.clearCookie("refreshToken");
      success(res, 200, response.message);
    })
    .catch((err) => {
      error(res, 400, err);
    });
};

// Optional: If you want to export all functions as a single object
export default {
  getUser,
  getUserId,
  getUsername,
  getEmail,
  registerUser,
  putUser,
  loginUser,
  changePassword,
  getRefreshToken,
  deleteUser,
};
