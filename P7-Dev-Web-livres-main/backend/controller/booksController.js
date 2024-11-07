const Books = require("../models/books");
const fs = require("fs");
//creer les livres
exports.creatBooks = (req, res, next) => {
  const nvbook = JSON.parse(req.body.book);
  const book = new Books({
    userId: nvbook.userId,
    title: nvbook.title,
    author: nvbook.author,
  /*   imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }` */
    imageUrl: `${req.protocol}://${req.get("host")}/images/${req.imageFilename}`, // Utilise req.imageFilename
    year: nvbook.year,
    genre: nvbook.genre,
    ratings: nvbook.ratings,
    averageRating: nvbook.averageRating,
  });

  book
    .save()
    .then(() => {
      res.status(201).json({ message: "Livre enregistré !" });
    })
    .catch((error) => {
      res.status(400).json({ error: error });
    });
};

//lire les livres
exports.readBooks = (req, res, next) => {
  Books.find()
    .then((dt) => {
      res.status(200).json(dt);
    })
    .catch((err) => res.status(400).json({ err }));
};

// lire un livre par Id
exports.readBookById = (req, res, next) => {
  Books.findOne({ _id: req.params.id })
    .then((dt) => res.status(200).json(dt))
    .catch((err) => res.status(404).json({ msg: err }));
};

exports.sortStart = (req, res, next) => {
  Books.find({})
    .select("title year averageRating imageUrl")
    .sort({ ratings: -1 })
    .then((dt) => {
      //ici gestion du nombre du nombre des mieux notés
      if (dt.length >= 3) {
        dt.length = 3;
      } else {
        dt.length <= 3;
      }
      res.status(200).json(dt);
    })
    .catch((err) => res.status(400).json({ msg: err }));
};

//modifier un livre

exports.modifierBook = (req, res, next) => {
  const modifBook = req.file
    ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${req.imageFilename}`,
      }
    : { ...req.body };

  delete modifBook.userId;

  Books.findOne({ _id: req.params.id })
    .then((book) => {
      if (book.userId != req.auth.userId) {
        res.status(401).json({ msg: "Not authorized" });
      } else {
        Books.updateOne({ _id: req.params.id }, { ...modifBook, _id: req.params.id })
          .then(() => res.status(200).json({ msg: "Livre modifié!" }))
          .catch((err) => res.status(400).json({ msg: err }));
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

exports.giverating = (req, res, next) => {
  const userId = req.body.userId;
  const grade = req.body.rating;

  if (grade < 0 || grade > 5) {
    return res.status(400).json({ error: "La note doit être entre 0 et 5." });
  }

  Books.findOne({ _id: req.params.id })
    .then((book) => {
      if (!book) {
        return res.status(404).json({ error: "Livre non trouvé." });
      }
      
     if (book.userId === req.auth.userId) {
        return res
          .status(400)
          .json({ error: "Vous ne pouvez pas noter votre propre livre." });
      } 

      const alreadyRated = book.ratings.some(
        (rating) => rating.userId === userId
      );
      if (alreadyRated) {
        return res.status(400).json({ error: "Vous avez déjà noté ce livre." });
      }

      book.ratings.push({ userId, grade });

      const totalRating = book.ratings.reduce((acc, gaval) => acc + gaval.grade, 0);

      book.averageRating  = (totalRating / book.ratings.length).toFixed(1);
      
      return book.save();
    })
    .then((dt) => {
      res.status(200).json(dt);
    })
    .catch((err) => {
      res.status(500).json({ msg: err.message });
    });
};


