const { fileURLToPath } = require("url");
const { dirname } = require("path");
const bcrypt = require("bcrypt")

//const __filename = fileURLToPath(import.meta.url);
//const __dirname = dirname(__filename);


const generaHash = (password)=> bcrypt.hashSync(password, bcrypt.genSaltSync(10))
const validaHash = (usuario, password) => bcrypt.compareSync(password, usuario.password)


module.exports = {
  __dirname,
  generaHash,
  validaHash,
};





// import { fileURLToPath } from "url";
// import { dirname } from "path";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

// export default __dirname;


