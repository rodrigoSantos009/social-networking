import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: function(req, file, callback) {
    callback(null, path.resolve("src/uploads/"));
  },
  filename: function(req, file, callback) {
    const time = new Date().getDate();
    callback(null, `${time}_${file.originalname}`);
  }
})

const upload = multer({ storage });

export default upload;