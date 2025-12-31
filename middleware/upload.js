import multer from "multer";
import multerS3 from "multer-s3";
import AWS from "aws-sdk";
import path from "path";

console.log("DEBUG S3_BUCKET =", process.env.S3_BUCKET);

// Configure S3 (Railway Bucket)
const s3 = new AWS.S3({
  endpoint: process.env.S3_ENDPOINT,
  accessKeyId: process.env.S3_KEY,
  secretAccessKey: process.env.S3_SECRET,
  region: process.env.S3_REGION,
  signatureVersion: "v4",
});

// Multer S3 storage
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.S3_BUCKET,
    acl: "public-read",
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: (req, file, cb) => {
      const fileName =
        Date.now().toString() + path.extname(file.originalname);
      cb(null, fileName);
    },
  }),
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpg"
    ) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"), false);
    }
  },
});

export default upload;
