import multer from "multer";

// Simple in-memory upload (NO S3, NO disk, NO bucket)
const upload = multer({
  storage: multer.memoryStorage(),
});

export default upload;
