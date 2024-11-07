// Middleware sharp
const path = require("path");
const fs = require("fs");
const sharp = require("sharp");

module.exports = {
  upload:  async (req, res, next) => {
    if (!req.file) {
      return res.status(400).json({ status: false, msg: "Aucun fichier téléchargé." });
    }
  
    try {     
      const filename = `${require("crypto").randomBytes(8).toString("hex")}.jpg`;
      const outputPath = path.join(__dirname, "../images", filename);
  
      await sharp(req.file.buffer)
        .resize(400, 350) 
        .toFormat("jpg")  
        .jpeg({ quality: 80 }) 

        .toFile(outputPath);

      req.imageFilename = filename;
      next();
    } catch (error) {
      return res.status(500).json({ status: false, msg: "Erreur de traitement de l'image" });
    }
   }
};
