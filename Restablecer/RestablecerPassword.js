const express = require('express');
const User = require('../modelos/usuarios');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const router = express.Router();
router.patch('/users/password', async (req, res) => {
  const { token, password } = req.body;

  try {
    console.log('Token recibido:', token);

    // Verificar y decodificar el token de restablecimiento de contraseña
    const decodedToken = jwt.verify(token, 'secreto', { expiresIn: '10s' });
    const userId = decodedToken.id;

    // Buscar al usuario en la base de datos por su ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado.' });
    }

    // Encriptar la nueva contraseña antes de guardarla en la base de datos
    const hashedPassword = await bcrypt.hash(password, 10);

    // Actualizar la contraseña del usuario
    user.Password = hashedPassword;
    await user.save();

    res.json({ message: 'Contraseña cambiada exitosamente.' });
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'El token de restablecimiento de contraseña ha expirado.' });
    }
    console.error(error);
    res.status(500).json({ error: 'Ocurrió un error al cambiar la contraseña del usuario.' });
  }
});

module.exports = router;