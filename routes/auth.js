/* 
    Rutas de usuarios / AUTH

    host + /api/auth
*/

const { Router } = require("express");
const {
  registerUser,
  loginUser,
  revalidateToken,
} = require("../controllers/auth");

const { validateJWT } = require("../middlewares/validateJWT");

const { check } = require("express-validator");
const { fieldValidator } = require("../middlewares/fieldValidators");

const router = Router();

router.post(
  "/new",
  [
    //middlewares
    check("name", "El nombre es obligatorio").not().isEmpty(),
    check("email", "El email  es obligatorio").isEmail(),
    check("password", "El password debe ser de 6 caracteres").isLength({
      min: 6,
    }),
    fieldValidator,
  ],
  registerUser
);

router.post(
  "/",
  [
    check("email", "El email  es obligatorio").isEmail(),
    check("password", "El password debe ser de 6 caracteres").isLength({
      min: 6,
    }),
    fieldValidator,
  ],
  loginUser
);

router.get("/renew", validateJWT, revalidateToken);

module.exports = router;
