// uTILs/form.js
import { UAParser } from "ua-parser-js";

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
export const logError = (context, error, req) => {
  const parser = new UAParser(req.headers["user-agent"]);
  const browser = parser.getBrowser();
  const os = parser.getOS();
  const device = parser.getDevice();

  // console.log(error);

  console.error(`[${context}] Error:`, {
    message: error.data || error.message,
    stack: error.stack,
    code: error.statusCode || null,
    browser: browser.name,
    os: os.name,
    device: device,
    path: req.path,
    method: req.method,
    ip: req.ip,
    timestamp: new Date().toISOString(),
  });
};

// If you prefer to export all functions as a single object:
export default {
  success,
  error,
  logError,
};
