  const express = require('express');
  const User = require('../modelos/usuarios');
  const bcrypt = require('bcrypt');
  
  
  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
 
  // Ruta para cambiar la contraseña de un usuario
    app.patch('/users/password', async (req, res) => {
    const { email, contraseñaantigua, nuevacontraseña } = req.body;
  
    try {
      // Buscar al usuario en la base de datos por su email
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado.' });
      }
  
      // Verificar si la contraseña actual proporcionada coincide con la contraseña almacenada
      const esIgual = await bcrypt.compare(contraseñaantigua, user.password);
      if (!esIgual) {
        return res.status(401).json({ error: 'La contraseña actual es igual a la anterior.' });
      }
  
      // Encriptar la nueva contraseña antes de guardarla en la base de datos
      const hashedPassword = await bcrypt.hash(nuevacontraseña, 10);
  
      // Actualizar la contraseña del usuario
      user.password = hashedPassword;
      await user.save();
  
      res.json({ message: 'Contraseña cambiada exitosamente.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Ocurrió un error al cambiar la contraseña del usuario.' });
    }
  });