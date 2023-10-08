const passport = require("passport");
const local = require("passport-local");
const modeloUsuarios = require("../dao/DB/models/usuarios.modelo.js");
const crypto = require("crypto");

const inicializaPassport = () => {
  passport.use(
    "registro",
    new local.Strategy(
      {
        usernameField: "email",
        passReqToCallback: true,
      },
      async (req, username, password, done) => {
        try {
            console.log("Pasando por passport registro! ...")
          //lógica de registro
          let { nombre, email, password } = req.body;

          if (!nombre || !email || !password) {
            // return res.redirect("/registro?error=Complete email, nombre, y contraseña");
            done(null, false);
          }

          let existe = await modeloUsuarios.findOne({ email });
          if (existe) {
            //return res.redirect("/registro?error=" + `Usuario ya está registrado: ${email}`);
            done(null, false);
          }

          password = crypto
            .createHmac("sha256", "palabraSecreta")
            .update(password)
            .digest("base64");

          let usuario = await modeloUsuarios.create({
            nombre,
            email,
            password,
          });

          done(null, usuario)
        } catch (error) {
          done(error);
        }
      }
    )
  );

  passport.use("login", new local.Strategy(
      {
        usernameField: 'email'
      },
      async (username, password, done) => {
          try{
               if (!email || !password) {
                 //return  res.status(400).send('faltan datos')
                 return res.redirect("/login?error=Faltan datos");
               }

               if (
                 email === "adminCoder@coder.com" &&
                 password === "adminCod3r123"
               ) {
                 req.session.usuario = {
                   nombre: "Coder",
                   email: "adminCoder@coder.com",
                   rol: "administrador",
                 };

                 //Se puso hardcodeado adminCoder@coder.com en el código de sessions.router.js porque no debía estar en la base de datos de usuarios.

                 return res.redirect("/");
               }
               password = crypto
                 .createHmac("sha256", "palabraSecreta")
                 .update(password)
                 .digest("base64");

               let usuario = await modeloUsuarios.findOne({ email, password });
               if (!usuario) {
                 //return res.status(401).send('credenciales incorrectas')
                 return res.redirect("/login?error=credenciales incorrectas");
               }
          } catch{
              //done(error, null)
              done(error);
          }
      }
   ));

passport.serializeUser((user, done)=>{
    done(null, user._id)
})

passport.deserializeUser( async (id, done)=>{
    let usuario = await modeloUsuarios.findById(id)
    done(null, usuario)
})

}; // fin de inicializaPassport

module.exports = inicializaPassport;
