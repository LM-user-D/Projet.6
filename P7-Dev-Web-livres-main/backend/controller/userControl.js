const User = require("../models/users");
const bCrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// creation user
exports.signup = (req, res, next) => {
  bCrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      const user = new User({
        email: req.body.email,
        password: hash,
      });
      user
        .save()
        .then(() => res.status(201).json({ message: "Utilisateur créé !" }))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ msg: error }));
};

//connection User
exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (user === null) {
        res.status(401).json({
          msg: "Paire identifiant/mot de passe incorrecte ",
        });
      }
      bCrypt
        .compare(req.body.password, user.password)
        .then((val) => {
          if (!val) {
            res.status(401).json({
              msg: "Paire identifiant/mot de passe incorrecte ",
            });
          }
          // à l place de "RAMDOM_TOKEN" peut-être utiliser le fichier .env 
          res.status(200).json({
            userId: user._id,
            token: jwt.sign({ userId: user._id }, "RAMDOM_TOKEN", {
              expiresIn: "24h",
            }),
          });
        })
        .catch((err) => res.status(500).json({ mes: err }));
    })
    .catch((err) => res.status(500).json({ msg: err }));
};
