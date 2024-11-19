import model from "../Models/user.js";
import { success, error } from "../Helpers/form.js";
import { fPagination } from "../Helpers/function.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const secretKey = process.env.SECRET_KEY || 270400;

export const getUser = (req, res) => {
  // const page = fPagination(req);
  model
    .getUser(req)
    .then((response) => {
      success(res, 200, response);
    })
    .catch((err) => {
      error(res, 400, err);
    });
};

export const getUserId = (req, res) => {
  model
    .getUserId(req)
    .then((response) => {
      if (response) {
        success(res, 200, response);
      } else {
        error(res, 400, "User Not Found");
      }
    })
    .catch((err) => {
      error(res, 400, err);
    });
};

export const getUsername = (req, res) => {
  model
    .getUsername(req, res)
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
  model
    .getEmail(req, res)
    .then((response) => {
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

// export const registerUser = (req, res) => {
//   const param = req.body;
//   console.log(param);
//   if (param.username == null) return error(res, 400, "Username can't be empty");
//   if (param.password == null) return error(res, 400, "Password can't be empty");
//   model
//     .registerUser(req, res)
//     .then((response) => {
//       console.log(response);
//       success(res, 200, "User " + response + " created successfully");
//     })
//     .catch((err) => {
//       console.log("le error is" + err);
//       error(res, 400, err);
//     });
// };

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
    const response = await model.registerUser(req, res);

    // Send success response
    return success(res, 200, `User ${response.username} created successfully`);
  } catch (err) {
    console.error("Error in registerUser controller:", err);
    return error(res, 400, err.message || "Registration failed");
  }
};

export const putUser = (req, res) => {
  //   const param = req.body;
  // if (param.password != null) return error(res, 400, "Password can't be empty");
  model
    .putUser(req)
    .then((response) => {
      success(res, 200, "User " + response.username + " updated successfully");
    })
    .catch((err) => {
      error(res, 400, err);
    });
};

export const loginUser = (req, res) => {
  const param = req.body;
  if (param.username == null) return error(res, 400, "Username can't be empty");
  if (param.password == null) return error(res, 400, "Password can't be empty");

  model
    .loginUser(req)
    .then((response) => {
      if (response) {
        if (bcrypt.compareSync(param.password, response.password)) {
          const token = jwt.sign({ id: response.id }, secretKey, {
            expiresIn: "3h",
          });
          success(res, {
            user_id: response.id,
            username: response.username,
            email: response.email,
            role: response.role,
            avatar: response.avatar,
            token: token,
          });
        } else {
          error(res, 400, "Password is incorrect");
        }
      } else {
        error(res, 400, "User not found");
      }
    })
    .catch((err) => {
      error(res, 400, err);
    });
};

export const deleteUser = (req, res) => {
  model
    .getUserId(req)
    .then((response) => {
      if (response) {
        model
          .deleteUser(req)
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

// exports.registerUser = (req, res) => {
//   if (req.body.username == null)
//     return form.error(res, 400, "Username can't be empty");
//   if (req.body.password == null)
//     return form.error(res, 400, "Password can't be empty");

//   model
//     .registerUser(req)
//     .then((result) => {
//       form.success(res, 200, "User created successfully");
//     })
//     .catch((err) => {
//       form.error(res, err);
//     });
// };

// exports.loginUser = (req, res) => {
//   if (req.body.username == null)
//     return form.error(res, 400, "Username can't be empty");
//   if (req.body.password == null)
//     return form.error(res, 400, "Password can't be empty");

//   model.loginUser(req).then((result) => {
//     if (result.length != 0) {
//       if (bcrypt.compareSync(req.body.password, result[0].password)) {
//         const token = jwt.sign({ id: result[0].id }, secretKey, {
//           expiresIn: "3h",
//         });
//         form.success(res, {
//           user_id: result[0].id,
//           username: result[0].username,
//           token: token,
//         });
//       } else {
//         form.error(res, 400, "Password incorrect");
//       }
//     } else {
//       form.error(res, 400, "User not found");
//     }
//   });
// };

// Optional: If you want to export all functions as a single object
export default {
  getUser,
  getUserId,
  getUsername,
  getEmail,
  registerUser,
  putUser,
  loginUser,
  deleteUser,
};
