const nodemailer = require('nodemailer');
const Usuario = require("../modelos/usuarios");
const { google } = require('googleapis');
const jwt = require('jsonwebtoken');

const CLIENT_ID = "975928472019-tpgpvt9dlcoau2rmdf13ubh6b71ec2n0.apps.googleusercontent.com";
const CLIENT_SECRET = "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";
const REDIRECT_URI = "https://developers.google.com/oauthplayground";
const REFRESH_TOKEN = "1//04nqsPClQae2eCgYIARAAGAQSNwF-L9IrEIyVrNTd5dRLG9VASFoB6DV7pOCeFZ3-mEcFvxWd5Fz1FMp5E3oJUsyz2O4eFI1imcg";
const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

async function sendMail(email) {
  const usuario = await Usuario.findOne({ Email: email });

  if (!usuario) {
    throw new Error('Usuario no encontrado');
  }

  try {
    const token = jwt.sign({ id: usuario._id }, 'secreto', { expiresIn: '10s' });
    const accessToken = await oAuth2Client.getAccessToken();
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: "dam2fct@gmail.com",
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessToken
      }
    });
    const mailOptions = {
      from: 'dam2fct@gmail.com',
      to: usuario.Email,
      subject: 'Restablecimiento de contraseña',
      html: `
        <p>Hola ${usuario.Nombre},</p>
        <p>Has solicitado restablecer tu contraseña. Haz clic en el siguiente enlace para cambiarla:</p>
        <p>EL TOKEN EXPIRA EN 10s</p>
        <a id="resetLink" href="http://localhost:3004/users/password?token=${token}">Restablecer contraseña</a>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Correo electrónico enviado');

    return info;
  } catch (error) {
    console.log('Error al enviar el correo electrónico', error);
    throw new Error('Error al enviar el correo electrónico');
  }
}

module.exports = sendMail;