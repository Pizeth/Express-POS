// module.exports = {
//   success: (res, status, result) => {
//     let form = {
//       status: status,
//       data: result
//     }
//     res.json(form);
//   },
//   error: (res, status, result) => {
//     let form = {
//       status: status,
//       data: result
//     }
//     res.json(form);
//   },
// };

// Helpers/form.js
export const success = (res, status, result) => {
  const form = {
    status: status,
    data: result,
  };
  res.json(form);
};

export const error = (res, status, result) => {
  const form = {
    status: status,
    data: result,
  };
  res.json(form);
};

// If you prefer to export all functions as a single object:
export default {
  success,
  error,
};
