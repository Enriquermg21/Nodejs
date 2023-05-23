const nodemailer = require('nodemailer');
const Usuario = require("../modelos/usuarios");
const jwt = require('jsonwebtoken');
const Role = require("../modelos/roles");


async function enviarCorreoRestablecerContraseña(email) {
  try {
    const usuario = await Usuario.findOne({ Email: email });

    if (!usuario) {
      throw new Error('Usuario no encontrado');
    }

    // Generar token de restablecimiento de contraseña
    const token = jwt.sign({ id: usuario._id }, 'secreto', { expiresIn: '15m' });

    // Enviar correo electrónico con el enlace de restablecimiento de contraseña
    const transporter = nodemailer.createTransport({
      // Configuración del transporte de correo (SMTP, API de servicios de correo, etc.)
    });

    const mailOptions = {
      from: 'dam2fct@gmail.com',
      to: usuario.Email,
      subject: 'Restablecimiento de contraseña',
      html: `
        <p>Hola ${usuario.Nombre},</p>
        <p>Has solicitado restablecer tu contraseña. Haz clic en el siguiente enlace para cambiarla:</p>
        <a href="http://tu_aplicacion.com/restablecer-contraseña/${token}">Restablecer contraseña</a>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Correo electrónico enviado', info.response);
    return { success: true };
  } catch (error) {
    console.log('Error al enviar el correo electrónico', error);
    throw new Error('Error al enviar el correo electrónico');
  }
}

module.exports = enviarCorreoRestablecerContraseña;