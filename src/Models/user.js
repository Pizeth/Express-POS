// Models/category.js
import prisma from "../Configs/connect.js";
import bcrypt from "bcrypt";
import upload from "./fileUpload.js";
const salt = bcrypt.genSaltSync(10);
import { getMaxPage } from "../Helpers/function.js";
import { url } from "inspector";
import pagination from "../Helpers/function.js";

export class User {
  constructor(data) {
    this.id = Number(data.id);
    this.username = data.username;
    this.email = data.email;
    this.password = data.password;
    this.avatar = data.avatar;
    this.profile = data.profile;
    this.isBan = Boolean(Number(data.isBan));
    this.enabledFlag = Boolean(Number(data.enabledFlag));
    this.role = data.role;
    this.createdBy = Number(data.createdBy);
    this.creationDate = new Date(data.creationDate);
    this.lastUpdatedBy = Number(data.lastUpdatedBy);
    this.lastUpdateDate = new Date(data.lastUpdateDate);
    this.objectVersionId = Number(data.objectVersionId);
  }
}

export const getUser = async (req) => {
  try {
    // const result = await prisma.stock.findMany({});
    const result = await pagination.getPaginatedData({
      model: "user",
      page: parseInt(req.query.page) || 1,
      pageSize: parseInt(req.query.pageSize) || 10,
      include: {
        profile: true,
      },
    });
    console.log(await result);
    result.data.map((data) => ({
      id: data.id,
      username: data.username,
      email: data.email,
      password: data.password,
      avatar: data.avatar,
      profile: data.profile,
      isBan: data.isBan,
      enabledFlag: data.enabledFlag,
      role: data.role,
      createdBy: data.createdBy,
      creationDate: data.creationDate,
      lastUpdatedBy: data.lastUpdatedBy,
      lastUpdateDate: data.lastUpdateDate,
      objectVersionId: data.objectVersionId,
    }));
    console.log(result);
    return result;

    // const allUsers = await prisma.user.findMany({
    //   include: {
    //     profile: true,
    //   },
    // });
    // return allUsers;
  } catch (error) {
    console.log(error);
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
    const result = new User(user);
    console.log(result);
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

export const registerUser = async (req, res) => {
  try {
    const { username, email, password, role, createdBy, lastUpdatedBy } =
      req.body;

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
      },
    });

    return user_data;
  } catch (error) {
    console.error("Error in registerUser model:", error);
    throw error; // Re-throw to be caught by the controller
  }
};

export const putUser = async (req, res) => {
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
    } = req.body;

    const pass = bcrypt.hashSync(password, salt);

    // First upload the file and wait for the response
    const uploadResponse = await upload.uploadFile(req, res, shortName);
    let image = avatar;
    if (uploadResponse.status == 200) {
      image = uploadResponse.url;
    }

    const user_data = await prisma.user.update({
      where: {
        id: Number(id),
      },
      data: {
        username: username,
        email: email,
        password: pass,
        avatar: image,
        role: role,
        createdBy: Number(createdBy),
        lastUpdatedBy: Number(lastUpdatedBy),
        objectVersionId: { increment: 1 },
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
  User,
};
