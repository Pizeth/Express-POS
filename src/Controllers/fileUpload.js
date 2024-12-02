// import express from "express";
// import multer from "multer";
// import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
// import r2 from "./Config/cloudflare";
// import { fileURLToPath } from "url";
// import { dirname } from "path";
import service from "../Services/fileUpload.js";
import { success, error } from "../Helpers/form.js";

// ES Module equivalent of __dirname
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

// Configure R2 client
// const R2 = new S3Client({
//   region: "auto",
//   endpoint: `https://${process.env.ACCOUNT_ID}.r2.cloudflarestorage.com`,
//   credentials: {
//     accessKeyId: process.env.R2_ACCESS_KEY_ID,
//     secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
//   },
// });

export const uploadFile = (req, res, fileName) => {
  // const page = fPagination(req);
  model
    .uploadFile(req, res, fileName)
    .then((response) => {
      success(res, 200, response);
    })
    .catch((err) => {
      error(res, 400, err);
    });
};

// File upload endpoint
// app.post("/upload", upload.single("file"), async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ error: "No file uploaded" });
//     }

//     const file = req.file;
//     const fileName = `${Date.now()}-${file.originalname}`;

//     // Upload to R2
//     const command = new PutObjectCommand({
//       Bucket: process.env.R2_BUCKET_NAME,
//       Key: fileName,
//       Body: file.buffer,
//       ContentType: file.mimetype,
//     });

//     await r2.send(command);

//     // Generate the public URL (if your bucket is public)
//     const publicUrl = `https://${process.env.R2_PUBLIC_DOMAIN}/${fileName}`;

//     res.json({
//       message: "File uploaded successfully",
//       fileName,
//       url: publicUrl,
//     });
//   } catch (error) {
//     console.error("Upload error:", error);
//     res.status(500).json({ error: "Failed to upload file" });
//   }
// });

export default { uploadFile };
