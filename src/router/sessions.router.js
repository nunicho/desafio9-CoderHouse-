const express = require("express");
//const mongoose = require("mongoose");
const router = express.Router();
const modeloUsuarios = require("../dao/DB/models/usuariosGithub.modelo.js");
const crypto = require("crypto");

//PARA TRAER PASSPORT
const passport = require("passport");

router.get("/errorRegistro", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.status(200).json({
    error: "Error de registro",
    //AQUI SE PODRIA PONER UN REDIRECT
  });
});

router.post(
  "/registro",
  passport.authenticate("registro", {
    failureRedirect: "/api/sessions/errorRegistro",
  }),
  async (req, res) => {
    try {
      let { nombre, email, password } = req.body;

      console.log(req.user);

      res.redirect(`/login?usuarioCreado=${email}`);
    } catch (error) {
      console.error("Error al registrar usuario:", error);
      //res.status(500).send("Ocurrió un error al registrar el usuario.");
      return res
        .status(500)
        .redirect("/login?error=Ocurrió un error al registrar el usuario");
    }
  }
);

router.get("/errorLogin", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.status(200).json({
    error: "Error Login",
  });
});

router.post(
  "/login",
  passport.authenticate("loginLocal", {
    failureRedirect: "/api/sessions/errorLogin",
  }),
  async (req, res) => { 
    console.log(req.user);   
    req.session.usuario = req.user;
    res.redirect("/");
  }
);

router.get("/logout", (req, res) => {
  req.session.destroy((e) => console.log(e));
  res.redirect("/login?mensaje=Logout correcto!");

  // AGREGAR MENSAJE DE LOGOUT CORRECTO  CON FONDO AZUL
});

router.get(
  "/github",
  passport.authenticate("loginGithub", {
    successRedirect: "/",
    failureRedirect: "/api/sessions/errorGithub",
  }),
  (req, res) => {}
);

router.get(
  "/callbackGithub",
  passport.authenticate("loginGithub", {
    failureRedirect: "/api/sessions/errorGithub",
  }),
  (req, res) => {
    console.log(req.user);
   req.session.usuario = req.user;
   res.redirect("/");
  }
  
);

// router.get(
//   "/callbackGithub",
//   passport.authenticate("loginGithub", {
//     failureRedirect: "/api/sessions/errorGithub",
//   }),
//   (req, res) => {
//     res.setHeader("Content-type", "application/json");
//     res.status(200).json({
//       mensaje: "Login OK",
//       usuario: req.user,
//     });
//   }
// );


router.get("/errorGithub", (req, res) => {
  res.setHeader("Content-type", "application/json");
  res.status(200).json({
    error: "Error en github",
  });
});


// LOGIN DEL ADMINISTRADOR

router.post("/loginAdmin", async (req, res) => {
  let { email, password } = req.body;

  if (!email || !password) {
    return res.redirect("/loginAdmin?error=Faltan datos");
  }

  if (email === "adminCoder@coder.com" && password === "adminCod3r123") {
    req.session.usuario = {
      nombre: "Coder",
      email: "adminCoder@coder.com",
      rol: "administrador",
    };
    // Se puso hardcodeado adminCoder@coder.com en el código de sessions.router.js porque no debía estar en la base de datos de usuarios.
    return res.redirect("/");
  } else {
    // Autenticación fallida
    return res.redirect("/loginAdmin?error=Credenciales incorrectas");
  }
});


module.exports = router;
