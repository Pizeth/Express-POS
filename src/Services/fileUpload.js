import r2 from "../Configs/cloudflare.js";
import { timeFormatter } from "../Utils/formatter.js";
import { fileURLToPath } from "url";
import { dirname } from "path";

// ES Module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const uploadFile = async (req, fileName) => {
  try {
    if (!req.file) {
      const UploadError = {
        status: 400,
        data: "No file upload",
      };
      return UploadError;
    }
    const file = req.file;
    const buffer = file.buffer;
    const mimetype = file.mimetype;

    const fileMeta = await r2.upload(
      fileName +
        `_${new Date().toJSON().slice(0, 10)}_` +
        timeFormatter.getUnixTimestamp(),
      buffer,
      mimetype
    );

    return fileMeta;
  } catch (error) {
    console.error("Upload error:", error);
    return null;
  }
};

export const deleteFile = async (fileName) => {
  try {
    const fileMeta = await r2.deleteFile(fileName);
    return fileMeta;
  } catch (error) {
    console.error("Deleting file error:", error);
    throw error;
  }
};

export default { uploadFile, deleteFile };

// const filenameDate =
//   fileName +
//   `_${new Date().toJSON().slice(0, 10)}_` +
//   timeFormatter.getUnixTimestamp();
// console.log(filenameDate);

// console.log("le file name is " + __filename);
// console.log("le directory name is " + __dirname);

// Upload to R2
// const command = new PutObjectCommand({
//   Bucket: process.env.R2_BUCKET_NAME,
//   Key: fileName,
//   Body: file.buffer,
//   ContentType: file.mimetype,
// });

// await r2.send(command);

// // Generate the public URL (if your bucket is public)
// const publicUrl = `${process.env.R2_PUBLIC_DOMAIN}/${fileName}`;

// const fileMeta = res.json({
//   message: "File uploaded successfully",
//   fileName,
//   url: publicUrl,
// });

// app.post("/upload", upload.single("file"), async (req, res) => {
//     try {
//       if (!req.file) {
//         return res.status(400).json({ error: "No file uploaded" });
//       }

//       const file = req.file;
//       const fileName = `${Date.now()}-${file.originalname}`;

//       // Upload to R2
//       const command = new PutObjectCommand({
//         Bucket: process.env.R2_BUCKET_NAME,
//         Key: fileName,
//         Body: file.buffer,
//         ContentType: file.mimetype,
//       });

//       await r2.send(command);

//       // Generate the public URL (if your bucket is public)
//       const publicUrl = `https://${process.env.R2_PUBLIC_DOMAIN}/${fileName}`;

//       res.json({
//         message: "File uploaded successfully",
//         fileName,
//         url: publicUrl,
//       });
//     } catch (error) {
//       console.error("Upload error:", error);
//       res.status(500).json({ error: "Failed to upload file" });
//     }
//   });
