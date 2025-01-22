const { response } = require("express");
const Usuario = require("../models/User.model");
const bcrypt = require("bcryptjs");
const { generateJWT } = require("../helpers/jwt");

const registerUser = async (req, res = response) => {
  const { email, password } = req.body;

  try {
    let user = await Usuario.findOne({ email });

    if (user) {
      return res.status(400).json({
        ok: false,
        msg: "Ya existe un usuario con ese correo electronico",
      });
    }

    user = new Usuario(req.body);

    //Encriptar contraseña
    const salt = bcrypt.genSaltSync();

    user.password = bcrypt.hashSync(password, salt);

    await user.save();

    //generar JWt
    const token = await generateJWT(user.id, user.name);

    res.status(201).json({
      ok: true,
      msg: user.id,
      name: user.name,
      token,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "Por favor hable con el administrador",
    });
  }
};

const loginUser = async (req, res = response) => {
  const { email, password } = req.body;

  try {
    const user = await Usuario.findOne({ email });

    if (!user) {
      return res.status(400).json({
        ok: false,
        msg: "El usuario no existe con ese email",
      });
    }

    //confirmar passwords

    const validPassword = bcrypt.compareSync(password, user.password);

    if (!validPassword) {
      return res.status(400).json({
        ok: false,
        msg: "Password incorrecta",
      });
    }

    //Generar JWt
    const token = await generateJWT(user.id, user.name);

    console.log(token);

    res.status(201).json({
      ok: true,
      uid: user.id,
      name: user.name,
      token,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "Por favor hable con el administrador",
    });
  }
};

const revalidateToken = async (req, res) => {
  const { uid, name } = req;

  //Nuevo jwt
  const token = await generateJWT(uid, name);

  res.json({ ok: true, token });
};

module.exports = { registerUser, loginUser, revalidateToken };
