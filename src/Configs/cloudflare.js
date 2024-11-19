import { config } from "dotenv";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

config();

// Configure R2 client
export const R2 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});
// const r2 = 5;
export const upload = async (fileName, buffer, mimetype) => {
  // Upload to R2
  const command = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: fileName,
    Body: buffer,
    ContentType: mimetype,
  });

  await R2.send(command);

  // Generate the public URL (if your bucket is public)
  const publicUrl = `${process.env.R2_PUBLIC_DOMAIN}/${fileName}`;

  const fileMEta = {
    status: 200,
    message: "File uploaded successfully",
    fileName,
    url: publicUrl,
  };
  return fileMEta;
};

export default { R2, upload };
