const jwt = require('jsonwebtoken');
const Usuario = require('../modelos/usuarios'); // Importa el modelo de Usuario

// Verificar si el usuario ha iniciado sesión correctamente
const verificarSesion = async (req, res) => {
    const token = req.headers.authorization;
  
    if (!token) {
      return res.status(401).json({ message: 'Acceso no autorizado. No se proporcionó un token de autenticación.' });
    }
  
    try {
      const decoded = jwt.verify(token, 'instituto-api');
      const usuario = await Usuario.findById(decoded.id);
  
      if (!usuario) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }
  
      // Aquí puedes realizar acciones adicionales con el usuario encontrado
  
      res.json({ message: 'Sesión válida' });
    } catch (error) {
      res.status(401).json({ message: 'Token inválido' });
    }
  };
  
  // Verificar si el usuario es administrador
  const verificarAdmin = async (req, res) => {
    const token = req.headers.authorization;
  
    if (!token) {
      return res.status(401).json({ message: 'Acceso no autorizado. No se proporcionó un token de autenticación.' });
    }
  
    try {
      const decoded = jwt.verify(token, 'instituto-api');
      const usuario = await Usuario.findById(decoded.id).populate('Roles');
  
      if (!usuario) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }
  
      // Aquí puedes realizar acciones adicionales con el usuario encontrado
  
      const isAdmin = usuario.Roles.some(role => role.Nombre === 'admin');
      if (isAdmin) {
        res.json({ message: 'El usuario es administrador' });
      } else {
        res.json({ message: 'El usuario no es administrador' });
      }
    } catch (error) {
      res.status(401).json({ message: 'Token inválido' });
    }
  };
  
  module.exports = {
    verificarSesion,
    verificarAdmin
  };