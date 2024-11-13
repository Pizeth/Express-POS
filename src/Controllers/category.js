// const categoryModel = require('../Models/category')
// const form = require('../Helpers/form')
// const { fPagination } = require('../Helpers/function')

// module.exports = {
//   getCategory: (req, res) => {
//   const page = fPagination(req);
//   categoryModel
//     .getCategory (req, page)
//     .then (response => {
//       form.success (res, 200, response);
//     })
//     .catch (error => {
//       form.error(res, 400, error);
//     });
//   },
//   getCategoryId: (req, res) => {
//   categoryModel
//     .getCategoryId(req)
//     .then (response => {
//       if(response.length > 0 ) {
//         form.success (res, 200, response);
//       } else {
//         form.error (res, 400, "ID Category Not Found")
//       }
//     })
//     .catch (error => {
//       form.error(res, 400, error);
//     });
//   },
//   postCategory: (req, res) => {
//     categoryModel
//       .postCategory (req)
//       .then (response => {
//         form.success (res, 200, "Category success added");
//       })
//       .catch (error => {
//         form.error(res, 400, error);
//       });
//   },
//   putCategory: (req, res) => {
//     categoryModel
//       .putCategory (req)
//       .then (response => {
//         form.success (res, 200, "Category success updated");
//       })
//       .catch (error => {
//         form.error(res, 400, error);
//       });
//   },
//   deleteCategory: (req, res) => {
//     categoryModel
//       .getCategoryId (req)
//       .then(response => {
//         if (response.length > 0) {
//           categoryModel
//           .deleteCategory (req)
//           .then(response => {
//             form.success (res, 200, "Category succes delete");
//           })
//           .catch(error => {
//             form.error (res, 400, error);
//           })
//         } else {
//           form.error (res, 400, "ID Product Not Found")
//         }
//       })
//       .catch (error => {
//         form.error(res, 400, error);
//       });
//   },
// };

// Controllers/category.js
import categoryModel from "../Models/category.js";
import { success, error } from "../Helpers/form.js";
import { fPagination } from "../Helpers/function.js";
import { response } from "express";

export const getCategory = (req, res) => {
  // const page = fPagination(req);
  categoryModel
    .getCategory(req)
    .then((response) => {
      success(res, 200, response);
    })
    .catch((err) => {
      error(res, 400, err);
    });
};

export const getCategoryId = (req, res) => {
  categoryModel
    .getCategoryId(req)
    .then((response) => {
      if (response) {
        success(res, 200, response);
      } else {
        error(res, 400, "ID Category Not Found");
      }
    })
    .catch((err) => {
      error(res, 400, err);
    });
};

export const postCategory = (req, res) => {
  categoryModel
    .postCategory(req)
    .then((response) => {
      success(res, 200, "Category name " + response.name + " success added");
    })
    .catch((err) => {
      error(res, 400, err);
    });
};

export const putCategory = (req, res) => {
  // categoryModel
  //   .getCategoryId(req)
  //   .then((response) => {
  //     console.log(response);
  //     if (response) {
  //       categoryModel
  //         .putCategory(req)
  //         .then((response) => {
  //           if (response) success(res, 200, "Category success updated");
  //         })
  //         .catch((err) => {
  //           error(res, 400, err);
  //         });
  //     } else {
  //       error(res, 400, "ID Product Not Found");
  //     }
  //   })
  //   .catch((err) => {
  //     error(res, 400, err);
  //   });

  categoryModel
    .putCategory(req)
    .then((response) => {
      if (response) success(res, 200, "Category success updated");
    })
    .catch((err) => {
      error(res, 400, err);
    });
};

export const deleteCategory = (req, res) => {
  categoryModel
    .getCategoryId(req)
    .then((response) => {
      if (response) {
        categoryModel
          .deleteCategory(req)
          .then((response) => {
            success(
              res,
              200,
              "Category name " + response.name + " success delete"
            );
          })
          .catch((err) => {
            error(res, 400, err);
          });
      } else {
        error(res, 400, "ID Product Not Found");
      }
    })
    .catch((err) => {
      error(res, 400, err);
    });
};

// Optional: If you want to export all functions as a single object
export default {
  getCategory,
  getCategoryId,
  postCategory,
  putCategory,
  deleteCategory,
};
