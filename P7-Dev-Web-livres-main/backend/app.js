const express = require("express");
const app = express();
const mongoose = require("mongoose");
const routeUser = require("./router/userRoute");
const reouteBooks = require("./router/booksRoutes");
app.use(express.json());
require("dotenv").config();

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
    );
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, PATCH, OPTIONS"
    );
    next();
});

mongoose.connect(process.env.DATABASE_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("Connexion à MongoDB réussie !"))
    .catch((err) => console.error("Erreur de connexion à MongoDB", err));
    
app.use("/api/books", reouteBooks);
app.use("/api/auth", routeUser);

module.exports = app;
