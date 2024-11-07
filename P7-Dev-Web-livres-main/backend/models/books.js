const mongoose = require("mongoose");
const { Schema } = mongoose;

const bookSchema = new Schema({
  userId: { type: String },
  title: { type: String, required: true },
  author: { type: String, required: true },
  imageUrl: { type: String, required: true },
  year: { type: Number, required: true },
  genre: { type: String, required: true },
  ratings: [
    {
      //ici userId donné par mongoDB
      userId: { type: String },
      grade: { type: Number },
    },
  ],
  averageRating: { type: Number },
});

const book = mongoose.model("Books", bookSchema);

module.exports = book;
