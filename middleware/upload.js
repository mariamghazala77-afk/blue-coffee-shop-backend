import multer from "multer";
import path from "path";

/*
  Configure how and where files are stored
*/
const storage = multer.diskStorage({
  // Folder where images will be saved
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },

  // Create a unique file name
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

/*
  Allow only image files
*/
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg"
  ) {
    cb(null, true); // Accept file
  } else {
    cb(new Error("Only image files are allowed"), false);
  }
};

/*
  Create multer instance
*/
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});

export default upload;
