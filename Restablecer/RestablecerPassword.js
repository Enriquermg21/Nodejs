const express = require('express');
const User = require('../modelos/usuarios');
const bcrypt = require('bcrypt');
const router = express.Router();

  router.patch('/users/password', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Buscar al usuario en la base de datos por su email
    const user = await User.findOne({ Email:email });
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado.' });
    }
    // Verificar si la contraseña actual proporcionada coincide con la contraseña almacenada
    const esIgual =  bcrypt.compare(password, user.Password);
    if (!esIgual) {
      return res.status(401).json({ error: 'La contraseña actual es igual a la anterior.' });
    }
    // Encriptar la nueva contraseña antes de guardarla en la base de datos
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Actualizar la contraseña del usuario
    user.Password = hashedPassword;
    await user.save();
    res.json({ message: 'Contraseña cambiada exitosamente.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ocurrió un error al cambiar la contraseña del usuario.' });
  }
});

module.exports = router;