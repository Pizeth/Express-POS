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

// Add a centralized error logging method
export const logError = (context, error) => {
  console.error(`[${context}] Error:`, {
    message: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString(),
  });
};

// If you prefer to export all functions as a single object:
export default {
  success,
  error,
  logError,
};
