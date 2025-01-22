const { response } = require("express");

const jwt = require("jsonwebtoken");

const validateJWT = (req, res = response, next) => {
  //X-TOKEN  headers
  const token = req.header("x-token");

  if (!token) {
    return res.status(401).json({
      ok: false,
      msg: " NO hay token en la validacion",
    });
  }

  try {
    const { uid, name } = jwt.verify(token, process.env.SECRET_JWT_SEED);

    req.uid = uid;
    req.name = name;
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      ok: false,
      msg: "Token no valido",
    });
  }

  console.log(token);

  next();
};

module.exports = { validateJWT };
