const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new Error("Authorization header missing");
    }
    const token = authHeader.split(" ")[1];
    const decodedToken = jwt.verify(token, "RAMDOM_TOKEN");
    const userId = decodedToken.userId;
    if (req.body.userId && req.body.userId !== userId) {
      throw new Error("Invalid userId");
    } else {
      req.auth = { userId }; 
      next();
    }
  } catch (err) {
    res
      .status(401)
      .json({ err: "Vous n'êtes pas autorisé à effectuer cette opération" });
  }
};
