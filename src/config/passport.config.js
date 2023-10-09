const passport = require("passport");
const github = require("passport-github2");

//const local = require("passport-local");
const modeloUsuariosGithub = require("../dao/DB/models/usuariosGithub.modelo.js");
const crypto = require("crypto");
const util = require("../util.js");

const inicializaPassport = () => {
  // passport.use(
  //   "registro",
  //   new local.Strategy(
  //     {
  //       usernameField: "email",
  //       passReqToCallback: true,
  //     },
  //     async (req, username, password, done) => {
  //       try {
  //         // console.log("Pasando por passport registro! ...")
  //         //lógica de registro
  //         let { nombre, email, password } = req.body;

  //         if (!nombre || !email || !password) {
  //           // return res.redirect("/registro?error=Complete email, nombre, y contraseña");
  //           done(null, false);
  //         }

  //         let existe = await modeloUsuarios.findOne({ email });
  //         if (existe) {
  //           //return res.redirect("/registro?error=" + `Usuario ya está registrado: ${email}`);
  //           done(null, false);
  //         }

  //         // password = crypto
  //         //   .createHmac("sha256", "palabraSecreta")
  //         //   .update(password)
  //         //   .digest("base64");

  //         let usuario = await modeloUsuarios.create({
  //           nombre,
  //           email,
  //           password: util.generaHash(password)
  //         });

  //         done(null, usuario)
  //       } catch (error) {
  //         done(error);
  //       }
  //     }
  //   )
  // );

  // passport.use("login", new local.Strategy(
  //     {
  //       usernameField: 'email'
  //     },
  //     async (username, password, done) => {
  //         try{
  //           if (!username || !password) {
  //             //return  res.status(400).send('faltan datos')
  //             //return res.redirect("/login?error=Faltan datos");
  //             return done(null, false);
  //           }

  //           // if (
  //           //   username === "adminCoder@coder.com" &&
  //           //   password === "adminCod3r123"
  //           // ) {
  //           //   // En lugar de redirigir aquí, simplemente pasa el usuario autenticado al callback done
  //           //   const user = {
  //           //     nombre: "Coder",
  //           //     email: "adminCoder@coder.com",
  //           //     rol: "administrador",
  //           //   };
  //           //   return done(null, user);
  //           // }
  //           //  password = crypto
  //           //    .createHmac("sha256", "palabraSecreta")
  //           //    .update(password)
  //           //    .digest("base64");

  //           //let usuario = await modeloUsuarios.findOne({ email:username, password:password });
  //           let usuario = await modeloUsuarios.findOne({ email:username});
  //           if (!usuario) {
  //             //return res.status(401).send('credenciales incorrectas')
  //             //return res.redirect("/login?error=credenciales incorrectas");
  //             return done(null, false);
  //           }else{
  //             if(!util.validaHash(usuario, password)){
  //               // clave invalida
  //               return done(null, false)
  //             }
  //           }

  //           usuario = {
  //             nombre: usuario.nombre,
  //             email: usuario.email,
  //             _id: usuario._id,
  //           };

  //           return done(null, usuario);
  //         } catch (error){
  //             //done(error, null)
  //             return done(error);
  //         }
  //     }
  //  ));

  passport.use(
    "github",
    new github.Strategy(
      {
        clientID: "Iv1.cc00dcea44bb45db",
        clientSecret: "764f4be595fd9209469809ec57f129d727a1f467",
        callbackURL: "http://localhost:8080/api/sessions/callbackGithub",
      },
      async (token, tokenRefresh, profile, done) => {
        try {
          console.log(profile);
          let usuario = await modeloUsuariosGithub.findOne({email: profile._json.email});
          if (!usuario) {
            usuario = await modeloUsuariosGithub.create({
              nombre: profile._json.name,
              email: profile._json.email,
              github: profile
            });
          }

          done(null, usuario);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.serializeUser((usuario, done) => {
    return done(null, usuario._id);
  });

  passport.deserializeUser(async (id, done) => {
    let usuario = await modeloUsuariosGithub.findById(id);
    return done(null, usuario);
  });
}; // fin de inicializaPassport

module.exports = inicializaPassport;
