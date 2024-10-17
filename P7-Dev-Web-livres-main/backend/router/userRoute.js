const express = require("express");
const router = express.Router();
const funcUser = require("../controller/userControl");
//creer un compte
router.post("/signup", funcUser.signup);

//connection  user
router.post("/login", funcUser.login);

module.exports = router;
