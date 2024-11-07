const mongoose = require("mongoose");
const { Schema } = mongoose;
const validateur = require("mongoose-unique-validator");

const userShema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

userShema.plugin(validateur);

const User = mongoose.model("User", userShema);

module.exports = User;
