import model from "../Models/product.js";
import { success, error } from "../Utils/form.js";

export const get = (req, res) => {
  // const page = fPagination(req);
  model
    .get(req)
    .then((response) => {
      success(res, 200, response);
    })
    .catch((err) => {
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
        error(res, 400, "Product Not Found!");
      }
    })
    .catch((err) => {
      error(res, 400, err);
    });
};

export const post = async (req, res) => {
  try {
    const param = req.body;

    // Validate required fields
    // if (!param.username) return error(res, 400, "Username can't be empty");
    // if (!param.password) return error(res, 400, "Password can't be empty");

    // Call the model function and await its response
    const response = await model.post(req, res);

    // Send success response
    return success(res, 200, `Product ${response.name} created successfully!`);
  } catch (err) {
    console.error("Error in post productType controller:", err);
    return error(res, 400, err.message || "Post Product failed!");
  }
};

export const put = (req, res) => {
  model
    .put(req)
    .then((response) => {
      success(res, 200, `Product ${response.name} updated successfully`);
    })
    .catch((err) => {
      error(res, 400, err);
    });
};

export const remove = (req, res) => {
  model
    .getId(req)
    .then((response) => {
      if (response) {
        model
          .remove(req)
          .then((response) => {
            success(res, 200, `Product ${response.name} deleted successfully`);
          })
          .catch((err) => {
            error(res, 400, err);
          });
      } else {
        error(res, 400, "Product Not Found");
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
