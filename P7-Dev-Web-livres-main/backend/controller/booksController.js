const Books = require("../models/books");
const fs = require("fs");
//creer les livres
exports.creatBooks = (req, res, next) => {
    const nvbook = JSON.parse(req.body.book);
    delete nvbook._id;
    delete nvbook.userId;

    const book = new Books({
        ...nvbook,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
            req.file.filename
        }`,
    });

    book.save()
        .then(() => {
            res.status(201).json({ message: "livre enregistré !" });
        })
        .catch((error) => {
            res.status(400).json({ error });
        });
};
//lire les livres
exports.readBooks = (req, res, next) => {
    Books.find()
        .then((dt) => {
            res.status(200).json(dt);
            console.log(123);
        })
        .catch((err) => res.status(400).json({ err }));
};

// lire un livre
exports.readBookById = (req, res, next) => {
    Books.findOne({ _id: req.params.id })
        .then((dt) => res.status(200).json(dt))
        .catch((err) => res.status(404).json({ msg: err }));
};
//modifier un livre

exports.modifierBook = (req, res, next) => {
    const modifBook = req.file
        ? {
              ...JSON.parse(req.body.book),
              imageUrl: `${req.protocol}://${req.get("host")}/images/${
                  req.file.filename
              }`,
          }
        : { ...req.body };

    delete modifBook.userId;
    Books.findOne({ _id: req.params.id })
        .then((book) => {
            if (book.userId != req.auth.userId) {
                res.status(401).json({ msg: "Not authorized" });
            } else {
                Books.updateOne(
                    { _id: req.params.id },
                    { ...modifBook, _id: req.params.id }
                )
                    .then(() => res.status(200).json({ msg: "Objet modifié!" }))
                    .catch((err) => res.status(401).json({ msg: err }));
            }
        })
        .catch((err) => {
            res.status(400).json({ msg: err });
        });
};

exports.deleteBook = (req, res, next) => {
    Books.findOne({ _id: req.params.id })
        .then((book) => {
            if (book.userId != req.auth.userId) {
                res.status(401).json({ msg: "Not authorized" });
            } else {
                const filename = book.imageUrl.split("/images/")[1];
                fs.unlink(`images/${filename}`, () => {
                    Books.deleteOne({ _id: req.params.id })
                        .then(() => {
                            res.status(200).json({ msg: "Objet supprimé" });
                        })
                        .catch((err) => res.status(401).json({ msg: err }));
                });
            }
        })
        .catch((err) => {
            res.status(500).json({ msg: err });
        });
};
