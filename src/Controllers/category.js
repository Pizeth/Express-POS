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
import model from "../Models/category.js";
import { success, error } from "../Utils/form.js";

export const get = (req, res) => {
  // const page = fPagination(req);
  model
    .get(req)
    .then((response) => {
      console.log(response);
      success(res, 200, response);
    })
    .catch((err) => {
      console.log(err);
      error(res, 400, err);
    });
};

export const getId = (req, res) => {
  model
    .getId(req)
    .then((response) => {
      if (response) {
        success(res, 200, response);
      } else {
        error(res, 400, "Category Not Found");
      }
    })
    .catch((err) => {
      error(res, 400, err);
    });
};

export const post = (req, res) => {
  model
    .post(req)
    .then((response) => {
      success(
        res,
        200,
        "Category name " + response.name + " added successfully!"
      );
    })
    .catch((err) => {
      error(res, 400, err);
    });
};

export const put = (req, res) => {
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

  model
    .put(req)
    .then((response) => {
      if (response) success(res, 200, "Category updated successfully!");
    })
    .catch((err) => {
      error(res, 400, err);
    });
};

export const remove = (req, res) => {
  model
    .remove(req)
    .then((response) => {
      if (response) {
        model
          .remove(req)
          .then((response) => {
            success(
              res,
              200,
              "Category name " + response.name + " deleted successfully!"
            );
          })
          .catch((err) => {
            error(res, 400, err);
          });
      } else {
        error(res, 400, "Category Not Found!");
      }
    })
    .catch((err) => {
      error(res, 400, err);
    });
};

// Optional: If you want to export all functions as a single object
export default {
  get,
  getId,
  post,
  put,
  remove,
};
