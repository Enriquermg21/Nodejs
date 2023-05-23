const nodemailer = require('nodemailer');

async function enviarCorreoRestablecimiento(email, token) {
  const transporter = nodemailer.createTransport({
    service: 'gmail', // Ejemplo: 'gmail', 'hotmail', etc.
    auth: {
      user: 'tu_correo_electronico',
      pass: 'tu_contraseña_del_correo_electronico'
    }
  });

  const correoOptions = {
    from: 'tuemail@example.com',
    to: email,
    subject: 'Restablecimiento de contraseña',
    text: `Haz clic en el siguiente enlace para restablecer tu contraseña: ${token}`,
  };

  await transporter.sendMail(correoOptions);
}