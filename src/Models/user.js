// Models/category.js
import prisma from "../Configs/connect.js";
import bcrypt from "bcrypt";
import upload from "./fileUpload.js";
const salt = bcrypt.genSaltSync(10);
import { getMaxPage } from "../Helpers/function.js";
import { url } from "inspector";

export const getUser = async (req) => {
  try {
    const allUsers = await prisma.user.findMany({
      include: {
        profile: true,
      },
    });
    return allUsers;
  } catch (error) {
    throw error;
  }
};

export const getUserId = async (req) => {
  try {
    const userId = Number(req.params.id);
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        profile: true,
      },
    });
    return user;
  } catch (error) {
    throw error;
  }
};

export const getUsername = async (req) => {
  try {
    const username = req.params.username;
    console.log(username);
    const user = await prisma.user.findFirst({
      where: {
        username: { equals: username, mode: "insensitive" },
      },
    });
    return user;
  } catch (error) {
    console.error("Error checking username: ", error);
    throw error;
  }
};

export const getEmail = async (req) => {
  try {
    const email = req.params.email;
    console.log(email);
    const user = await prisma.user.findFirst({
      where: {
        email: { equals: email, mode: "insensitive" },
      },
    });
    return user;
  } catch (error) {
    console.error("Error checking email: ", error);
    throw error;
  }
};

// export const registerUser = async (req, res) => {
//   try {
//     const {
//       username,
//       email,
//       password,
//       role,
//       createdBy,
//       lastUpdatedBy,
//       objectVersionId,
//     } = req.body;

//     upload
//       .uploadFile(req, res, username)
//       .then(async (response) => {
//         // success(res, 200, response);
//         const avatar = response.url;
//         console.log(avatar);
//         const pass = bcrypt.hashSync(password, salt);
//         const user_data = await prisma.user.create({
//           data: {
//             username: username,
//             email: email,
//             password: pass,
//             role: role,
//             avatar: avatar,
//             createdBy: Number(createdBy),
//             lastUpdatedBy: Number(lastUpdatedBy),
//             objectVersionId: Number(objectVersionId),
//           },
//         });
//         return user_data;
//       })
//       .catch((err) => {
//         console.log("error is" + err);
//         // error(res, 400, err);
//       });
//   } catch (error) {
//     console.log("error is" + error);
//     throw error;
//   }
// };

export const registerUser = async (req, res) => {
  try {
    const {
      username,
      email,
      password,
      role,
      createdBy,
      lastUpdatedBy,
      objectVersionId,
    } = req.body;

    // First upload the file and wait for the response
    const uploadResponse = await upload.uploadFile(req, res, username);
    let avatar = "";
    if (uploadResponse.status == 200) {
      avatar = uploadResponse.url;
      console.log("avatar url: " + avatar);
    } else {
      console.log(uploadResponse);
    }

    // Hash password
    const pass = bcrypt.hashSync(password, salt);

    // Create user in database
    const user_data = await prisma.user.create({
      data: {
        username: username,
        email: email,
        password: pass,
        role: role,
        avatar: avatar,
        createdBy: Number(createdBy),
        lastUpdatedBy: Number(lastUpdatedBy),
        objectVersionId: Number(objectVersionId),
      },
    });

    return user_data;
  } catch (error) {
    console.error("Error in registerUser model:", error);
    throw error; // Re-throw to be caught by the controller
  }
};

export const putUser = async (req) => {
  try {
    const {
      id,
      username,
      email,
      password,
      avatar,
      role,
      createdBy,
      lastUpdatedBy,
      objectVersionId,
    } = req.body;
    const pass = bcrypt.hashSync(password, salt);
    const user_data = await prisma.user.update({
      where: {
        id: Number(id),
      },
      data: {
        username: username,
        email: email,
        password: pass,
        avatar: avatar,
        role: role,
        createdBy: Number(createdBy),
        lastUpdatedBy: Number(lastUpdatedBy),
        objectVersionId: Number(objectVersionId),
      },
    });
    return user_data;
  } catch (error) {
    throw error;
  }
};

export const loginUser = async (req) => {
  try {
    const { username } = req.body;
    console.log(username);
    const login_user = await prisma.user.findFirst({
      where: {
        // username: username,
        OR: [
          {
            email: { equals: username, mode: "insensitive" },
          },
          { username: username },
        ],
      },

      include: {
        profile: true,
      },
    });
    return login_user;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const deleteUser = async (req) => {
  try {
    const userId = Number(req.params.id);
    const user = await prisma.user.delete({
      where: {
        id: Number(userId),
      },
    });
    return user;
  } catch (error) {
    throw error;
  }
};

// exports.registerUser = (req) => {
//   const body = req.body;
//   const pass = bcrypt.hashSync(body.password, salt);
//   return new Promise((resolve, reject) => {
//     conn.query(
//       `INSERT INTO user SET username = ?, password = ?`,
//       [body.username, pass],
//       (err, result) => {
//         if (!err) resolve(result);
//         else reject(err);
//       }
//     );
//   });
// };

// exports.loginUser = (req) => {
//   return new Promise((resolve, reject) => {
//     conn.query(
//       `SELECT * FROM user WHERE username = ?`,
//       [req.body.username],
//       (err, result) => {
//         if (!err) resolve(result);
//         else reject(err);
//       }
//     );
//   });
// };

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
