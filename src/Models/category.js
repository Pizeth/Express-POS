// const connection = require("../Configs/connect");
// const { getMaxPage } = require("../Helpers/function");
// import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();

// console.log(allUsers);
// module.exports = {
//   getCategories: async () => {
//     const allCategories = await prisma.category.findMany();
//     return allCategories;
//   },
//   getCategory: (req, page) => {
//     const sql = "SELECT * FROM category";

//     return new Promise((resolve, reject) => {
//       getMaxPage(page, null, "category")
//         .then((maxPage) => {
//           const infoPage = {
//             currentPage: page.page,
//             totalAllCategories: maxPage.totalProduct,
//             maxPage: maxPage.maxPage,
//           };

//           connection.query(
//             `${sql} LIMIT ? OFFSET ?`,
//             [page.content, page.offset],
//             (err, data) => {
//               if (!err) resolve({ infoPage, data });
//               else reject(err);
//             }
//           );
//         })
//         .catch((err) => {
//           reject(err);
//         });
//     });
//   },
//   getCategoryId: (req) => {
//     return new Promise((resolve, reject) => {
//       const id = req.params.id;
//       const sql = "SELECT * FROM category WHERE id = ?";
//       connection.query(sql, [id], (err, response) => {
//         if (!err) {
//           resolve(response);
//         } else {
//           reject(err);
//         }
//       });
//     });
//   },
//   postCategory: (req) => {
//     return new Promise((resolve, reject) => {
//       const name = req.body.name;
//       connection.query(
//         "INSERT INTO category SET name=?",
//         [name],
//         (err, response) => {
//           if (!err) {
//             resolve(response);
//           } else {
//             reject(err);
//           }
//         }
//       );
//     });
//   },
//   putCategory: (req) => {
//     return new Promise((resolve, reject) => {
//       const body = req.body;
//       const checkCategoryId = "SELECT id FROM category WHERE id=?";
//       const sql = "UPDATE category SET name=? WHERE id=?";

//       connection.query(checkCategoryId, [body.id], (err, response) => {
//         if (response.length > 0) {
//           connection.query(sql, [body.name, body.id], (err, response) => {
//             if (!err) {
//               resolve(response);
//             } else {
//               reject(err);
//             }
//           });
//         } else {
//           reject("ID Category Not Found");
//         }
//       });
//     });
//   },
//   deleteCategory: (req) => {
//     return new Promise((resolve, reject) => {
//       const id = req.params.id;
//       connection.query(
//         "DELETE FROM category WHERE id=?",
//         [id],
//         (err, response) => {
//           if (!err) {
//             resolve(response);
//           } else {
//             reject(err);
//           }
//         }
//       );
//     });
//   },
// };

// Models/category.js
import prisma from "../Configs/connect.js";
import upload from "../Services/fileUpload.js";
import { getMaxPage } from "../Helpers/function.js";

export const get = async (req) => {
  try {
    const allCategories = await prisma.category.findMany({
      include: {
        subCategories: {
          include: {
            products: true,
          },
        },
      },
    });
    return allCategories;
  } catch (error) {
    throw error;
  }
};

export const getId = async (req) => {
  try {
    const id = Number(req.params.id);
    const result = await prisma.category.findUnique({
      where: {
        id: id,
      },
      include: {
        subCategories: {
          include: {
            products: true,
          },
        },
      },
    });
    return result;
  } catch (error) {
    throw error;
  }
};

export const post = async (req, res) => {
  try {
    const {
      shortName,
      name,
      description,
      createdBy,
      lastUpdatedBy,
      objectVersionId,
    } = req.body;

    // First upload the file and wait for the response
    const uploadResponse = await upload.uploadFile(req, res, shortName);
    let image = "";
    if (uploadResponse.status == 200) {
      image = uploadResponse.url;
      console.log("image url: " + image);
    }

    const result = await prisma.category.create({
      data: {
        shortName: shortName,
        name: name,
        description: description,
        image: image,
        createdBy: Number(createdBy),
        lastUpdatedBy: Number(lastUpdatedBy),
        objectVersionId: Number(objectVersionId),
      },
    });
    return result;
  } catch (error) {
    throw error;
  }
};

export const put = async (req, res) => {
  try {
    const {
      id,
      shortName,
      name,
      description,
      image,
      createdBy,
      lastUpdatedBy,
      objectVersionId,
    } = req.body;

    // First upload the file and wait for the response
    const uploadResponse = await upload.uploadFile(req, res, shortName);
    let imagePath = image;
    if (uploadResponse.status == 200) {
      imagePath = uploadResponse.url;
    }

    const result = await prisma.category.update({
      where: {
        id: Number(id),
      },
      data: {
        shortName: shortName,
        name: name,
        description: description,
        image: imagePath,
        createdBy: Number(createdBy),
        lastUpdatedBy: Number(lastUpdatedBy),
        objectVersionId: Number(objectVersionId),
      },
    });
    return result;
  } catch (error) {
    throw error;
  }
  // return new Promise((resolve, reject) => {
  //   const { id, name } = req.body;
  //   const checkCategoryId = "SELECT id FROM category WHERE id=?";
  //   const sql = "UPDATE category SET name=? WHERE id=?";

  //   connection.query(checkCategoryId, [id], (err, response) => {
  //     if (response.length > 0) {
  //       connection.query(sql, [name, id], (err, response) => {
  //         if (!err) {
  //           resolve(response);
  //         } else {
  //           reject(err);
  //         }
  //       });
  //     } else {
  //       reject("ID Category Not Found");
  //     }
  //   });
  // });
};

export const remove = async (req) => {
  try {
    const id = Number(req.params.id);
    const result = await prisma.category.delete({
      where: {
        id: Number(id),
      },
    });
    return result;
  } catch (error) {
    throw error;
  }
};

// export const postCategory = (req) => {
//   return new Promise((resolve, reject) => {
//     const { name } = req.body;
//     connection.query(
//       "INSERT INTO category SET name=?",
//       [name],
//       (err, response) => {
//         if (!err) {
//           resolve(response);
//         } else {
//           reject(err);
//         }
//       }
//     );
//   });
// };

// export const getCategory = (req, page) => {
//   const sql = "SELECT * FROM category";

//   return new Promise((resolve, reject) => {
//     getMaxPage(page, null, "category")
//       .then((maxPage) => {
//         const infoPage = {
//           currentPage: page.page,
//           totalAllCategories: maxPage.totalProduct,
//           maxPage: maxPage.maxPage,
//         };

//         connection.query(
//           `${sql} LIMIT ? OFFSET ?`,
//           [page.content, page.offset],
//           (err, data) => {
//             if (!err) resolve({ infoPage, data });
//             else reject(err);
//           }
//         );
//       })
//       .catch((err) => {
//         reject(err);
//       });
//   });
// };

// export const getCategoryId = (req) => {
//   return new Promise((resolve, reject) => {
//     const id = req.params.id;
//     const sql = "SELECT * FROM category WHERE id = ?";
//     connection.query(sql, [id], (err, response) => {
//       if (!err) {
//         resolve(response);
//       } else {
//         reject(err);
//       }
//     });
//   });
// };

// export const postCategory = (req) => {
//   return new Promise((resolve, reject) => {
//     const { name } = req.body;
//     connection.query(
//       "INSERT INTO category SET name=?",
//       [name],
//       (err, response) => {
//         if (!err) {
//           resolve(response);
//         } else {
//           reject(err);
//         }
//       }
//     );
//   });
// };

// export const putCategory = (req) => {
//   return new Promise((resolve, reject) => {
//     const { id, name } = req.body;
//     const checkCategoryId = "SELECT id FROM category WHERE id=?";
//     const sql = "UPDATE category SET name=? WHERE id=?";

//     connection.query(checkCategoryId, [id], (err, response) => {
//       if (response.length > 0) {
//         connection.query(sql, [name, id], (err, response) => {
//           if (!err) {
//             resolve(response);
//           } else {
//             reject(err);
//           }
//         });
//       } else {
//         reject("ID Category Not Found");
//       }
//     });
//   });
// };

// export const deleteCategory = (req) => {
//   return new Promise((resolve, reject) => {
//     const { id } = req.params;
//     connection.query(
//       "DELETE FROM category WHERE id=?",
//       [id],
//       (err, response) => {
//         if (!err) {
//           resolve(response);
//         } else {
//           reject(err);
//         }
//       }
//     );
//   });
// };

// Optional: Default export with all methods
export default {
  get,
  getId,
  post,
  put,
  remove,
};
