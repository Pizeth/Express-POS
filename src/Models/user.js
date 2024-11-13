// Models/category.js
import prisma from "../Configs/connect.js";
import bcrypt from "bcrypt";
const salt = bcrypt.genSaltSync(10);
import { getMaxPage } from "../Helpers/function.js";

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

export const registerUser = async (req) => {
  try {
    const {
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
    const user_data = await prisma.user.create({
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
    console.log(error);
    throw error;
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
    const user = await prisma.category.delete({
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
  registerUser,
  putUser,
  loginUser,
  deleteUser,
};
