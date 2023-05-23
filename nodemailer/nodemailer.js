const nodemailer = require('nodemailer');

async function enviarCorreoRestablecimiento(email, token) {
  const transporter = nodemailer.createTransport({
    service: 'gmail', // Ejemplo: 'gmail', 'hotmail', etc.
    auth: {
      user: 'dam2fct@gmail.com',
      pass: 'dam2fctfran'
    }
  });

  const correoOptions = {
    from: 'dam2fct@gmail.com',
    to: email,
    subject: 'Restablecimiento de contraseña',
    text: `Haz clic en el siguiente enlace para restablecer tu contraseña: ${token}`,
  };

  await transporter.sendMail(correoOptions);
}