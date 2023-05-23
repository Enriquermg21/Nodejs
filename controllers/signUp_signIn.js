const Usuario = require("../modelos/usuarios");
const jwt = require('jsonwebtoken');
const Role = require("../modelos/roles");
const nodemailer = require('nodemailer');
const enviarCorreoRestablecerContraseña = require('../nodemailer/nodemailer')
let intentosFallidos = 0;

while(intentosFallidos>= 3){
  this.signIn();
}

module.exports = {
  signUp: async (req, res) => {

    const {Nombre,Email,Password,Roles} = req.body;
    
    const nuevoUsuario = new Usuario({
      Nombre,
      Email,
      Password: await Usuario.contraseñaEncriptada(Password),
      Roles
    })
    if(Roles){
      const buscaRole = await Role.find({Rol: {$in: Roles}})
      nuevoUsuario.Roles = buscaRole.map(role => role._id)
    }else{
      const role = await Role.findOne({Rol:"User"})
      nuevoUsuario.Roles = [role.id];
    }
    const usuarioGuardado = await nuevoUsuario.save();
    const token = jwt.sign({id:usuarioGuardado._id},"secreto",{
      expiresIn:'1h' 
    });
    
    res.json({token});
  },
  signIn: async (req, res) => {
    const { email, password } = req.body;
    const buscarUsuario = await Usuario.findOne({ Email: email }).populate("Roles");

    if (!buscarUsuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const compararContraseña = await Usuario.compararContraseña(password, buscarUsuario.Password);
    
    if (!compararContraseña) {
      
      intentosFallidos++;
      console.log(intentosFallidos)
      if (intentosFallidos >= 3) {
        // Llamada al método para enviar correo de restablecimiento de contraseña
        console.log(email)
        await enviarCorreoRestablecerContraseña(email);
        console.log(email)

        return res.status(401).json({ token: null, message: 'Contraseña inválida. Se ha enviado un correo para restablecerla.' });
      }

      await buscarUsuario.save();
      return res.status(401).json({ token: null, message: 'Contraseña inválida' });
    }

    buscarUsuario.intentosFallidos = 0;
    await buscarUsuario.save();

    const token = jwt.sign({ id: buscarUsuario._id }, "instituto-api", {
      expiresIn: 86400
    });
    res.json({token})
  },

};