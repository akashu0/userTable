const jwt = require("jsonwebtoken");

const authenticationMiddleware = (req, res, next) => {
  const customReq = req;
  let token = "";
  if (
    customReq.headers.authorization &&
    customReq.headers.authorization.startsWith("Bearer")
  ) {
    token = customReq.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(HttpStatus.UNAUTHORIZED).json({
      success: false,
      message: "UNAUTHORIZED PERSON",
    });
  }
  try {
    const { id, role } = jwt.verify(token, configkey.JWT_KEY);
    next();
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = authenticationMiddleware;
