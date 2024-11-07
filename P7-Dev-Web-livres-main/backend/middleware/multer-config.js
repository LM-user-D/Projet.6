// multerConfig.js
const multer = require("multer");


const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = ["image/jpeg", "image/png"];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      return cb(new Error("Type de fichier non supporté."), false);
    }
    cb(null, true);
  }
});

module.exports = upload.single("image");
