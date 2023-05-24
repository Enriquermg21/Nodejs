const nodemailer = require('nodemailer');
const Usuario = require("../modelos/usuarios");
const jwt = require('jsonwebtoken');
const { google } = require('googleapis');
const CLIENTD_ID = "975928472019-tpgpvt9dlcoau2rmdf13ubh6b71ec2n0.apps.googleusercontent.com";
const CLIENT_SECRET = "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";
const REDIRECT_URI = "https://developers.google.com/oauthplayground";
const REFRESH_TOKEN = "1//04nqsPClQae2eCgYIARAAGAQSNwF-L9IrEIyVrNTd5dRLG9VASFoB6DV7pOCeFZ3-mEcFvxWd5Fz1FMp5E3oJUsyz2O4eFI1imcg";
const oAuth2Client =  new google.auth.OAuth2(
  CLIENTD_ID,
  CLIENT_SECRET,
  REDIRECT_URI,
  REFRESH_TOKEN
);
oAuth2Client.setCredentials({refresh_token : REFRESH_TOKEN})

async function enviarCorreoRestablecerContraseña() {
  try {
    const usuario = await Usuario.findOne({ Email:email });
    const accessToken=await oAuth2Client.getAccessToken()
    // Enviar correo electrónico con el enlace de restablecimiento de contraseña
    const transporter = nodemailer.createTransport({
      service:"gmail",
      auth:{
        type:"OAuth2",
        user:"dam2fct@gmail.com",
        clientId:CLIENTD_ID,
        clientSecret:CLIENT_SECRET,
        refresh_Token:REFRESH_TOKEN,
        accessToken:accessToken
      }
      
    });
    const token = jwt.sign({ id: usuario._id }, 'secreto', { expiresIn: '15m' });
    const mailOptions = {
      from: 'dam2fct@gmail.com',
      to: 'dam2fct@gmail.com',
      subject: 'Restablecimiento de contraseña',
      html: 
        `<p>Hola ${usuario.Nombre},</p>
        <p>Has solicitado restablecer tu contraseña. Haz clic en el siguiente enlace para cambiarla:</p>
        <a href="http://tu_aplicacion.com/restablecer-contraseña/${token}">Restablecer contraseña</a>
      `
    };
    
    if (!usuario) {
      throw new Error('Usuario no encontrado');
    }
    
    const info = await transporter.enviarCorreoRestablecerContraseña(mailOptions);
    console.log('Correo electrónico enviado', info.response);
    return {info};

  } catch (error) {
    console.log('Error al enviar el correo electrónico', error);
    throw new Error('Error al enviar el correo electrónico');
  }
}
enviarCorreoRestablecerContraseña()
  .then((result)=>result.status(200).send("enviado"))
  .catch((error)=>console.log(error.message));


module.exports = enviarCorreoRestablecerContraseña;