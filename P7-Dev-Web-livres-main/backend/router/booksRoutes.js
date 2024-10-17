const express = require("express");
const router = express.Router();
const functBooks = require("../controller/booksController");
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");

//lire les livres
router.get("/", auth, functBooks.readBooks);

router.get("/:id", auth, functBooks.readBookById);
router.get("/bestrating", auth);

//creer les livres
router.post("/", auth, multer, functBooks.creatBooks);

//modifier les livres
router.put("/:id", auth, multer, functBooks.modifierBook);

//delete les livres
router.delete("/:id", auth, functBooks.deleteBook);

module.exports = router;
