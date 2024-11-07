const express = require("express");
const router = express.Router();
const functBooks = require("../controller/booksController");
const multer = require("../middleware/multer-config");

const sharpConfig = require("../middleware/sharp-config");

const auth = require("../middleware/auth");

//lire les livres
router.get("/", functBooks.readBooks);
router.get("/bestrating", functBooks.sortStart);

router.get("/:id", functBooks.readBookById);

//creer les livres
router.post("/", auth, multer, sharpConfig.upload, functBooks.creatBooks);

router.post("/:id/rating", auth, functBooks.giverating);

//modifier les livres
router.put("/:id", auth, multer, sharpConfig.upload, functBooks.modifierBook);

//delete les livres
router.delete("/:id", auth, functBooks.deleteBook);

module.exports = router;
