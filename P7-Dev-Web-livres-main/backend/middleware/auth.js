const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, process.env.JWT_TOKEN);
        
        const userId = decodedToken.userId;
        req.auth = {
            userId: userId,
        };

        //ici ajout de next
        next()


    } catch (err) {
        res.status(401).json({ err });
    }
};