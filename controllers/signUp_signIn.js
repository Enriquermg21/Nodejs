const Usuario = require("../modelos/usuarios");
const jwt = require('jsonwebtoken');
const Role = require("../modelos/roles");
const nodemailer = require('nodemailer');
let intentosFallidos = 0;
const MAX_INTENTOS_FALLIDOS = 3;
/**
 * @swagger
 * /signup:
 *   post:
 *     summary: Crea un nuevo usuario
 *     tags:
 *       - Autenticación
 *     requestBody:
 *       description: Objeto con los datos del usuario a crear
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Nombre:
 *                 type: string
 *                 example: John Doe
 *               Email:
 *                 type: string
 *                 example: johndoe@example.com
 *               Password:
 *                 type: string
 *                 example: mypassword123
 *               Roles:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Profesor"]
 *     responses:
 *       200:
 *         description: Retorna el token de autenticación del nuevo usuario
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzMjU3NzUwMDAwMDAwMDAwMDAwMDAwMSIsImlhdCI6MTYyMjg3MjcyMSwiZXhwIjoxNjIyOTU5MTIxfQ.1D6m-y5J2l5OR5zlZkf5ah8Cz0H2QVUhjKlltBhqap8
 *       400:
 *         description: Datos del usuario faltantes o inválidos
 *       500:
 *         description: Error en el servidor al crear el usuario
 */

/**
 * @swagger
 * /api/autorizacion/signin:
 *   post:
 *     summary: Iniciar sesión con email y contraseña
 *     tags:
 *       - Autenticación
 *     requestBody:
 *       description: Objeto con los datos del usuario que desea iniciar sesión
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: johndoe@example.com
 *               password:
 *                 type: string
 *                 example: mypassword123
 *     responses:
 *       200:
 *         description: Retorna el token de autenticación del usuario
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       401:
 *         description: Credenciales inválidas
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error en el servidor al iniciar sesión
 */


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
    const buscarUsuario = await Usuario.findOne({Email: req.body.email}).populate("Roles")
    if(!buscarUsuario) return res.status(404).json({message:"Usuario no encontrado"})

    const compararContraseña = await Usuario.compararContraseña(req.body.password,buscarUsuario.Password)

    if (!compararContraseña) {

      if (intentosFallidos >= MAX_INTENTOS_FALLIDOS) {
        // Genera un token de recuperación de contraseña
        const tokenRecuperacion = generarTokenRecuperacion();
    
        // Guarda el token de recuperación de contraseña en la base de datos para el usuario correspondiente
    
        // Configura el correo electrónico de recuperación de contraseña
        const correoRecuperacion = {
          from: 'tu_correo_electronico',
          to: 'correo_electronico_del_usuario',
          subject: 'Recuperación de Contraseña',
          text: `Has excedido el número máximo de intentos de inicio de sesión. Haz clic en el siguiente enlace para recuperar tu contraseña: ${enlaceRecuperacion}`,
          // Puedes utilizar HTML para personalizar el contenido del correo electrónico si lo deseas
          // html: '<p>Has excedido el número máximo de intentos de inicio de sesión. Haz clic en el siguiente enlace para recuperar tu contraseña: <a href="' + enlaceRecuperacion + '">Recuperar Contraseña</a></p>'
        };
    
        // Envía el correo electrónico de recuperación de contraseña
        transporter.sendMail(correoRecuperacion, (error, info) => {
          if (error) {
            console.log('Error al enviar el correo de recuperación de contraseña:', error);
            // Maneja el error adecuadamente, por ejemplo, enviando una respuesta de error al cliente
          } else {
            console.log('Correo de recuperación de contraseña enviado:', info.response);
            // Envía una respuesta exitosa al cliente, informándole que se ha enviado el correo de recuperación de contraseña
          }
        });
      }
    }
    const token = jwt.sign({id:buscarUsuario._id}, "instituto-api",{
      expiresIn: 86400
    })
    res.json({token})
  },
 
};