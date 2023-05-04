const Usuario = require("../models/Usuario");
const jwt = require('jsonwebtoken');
const Role = require("../models/Roles");
const Padre = require("../models/padre");

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
      const role = await Role.findOne({Rol:"Alumno"})
      nuevoUsuario.Roles = [role.id];
    }
    //-------------------- Creacion de padre una vez añadido el usuario

    const buscoPadre = await Role.find({_id: {$in: nuevoUsuario.Roles}})
    for(let i = 0; i < buscoPadre.length; i++){
      if(buscoPadre[i].Rol === 'Padre'){
        const padre = new Padre({
          nombre: req.body.Nombre,
          apellido: req.body.apellido,
          correo: req.body.Email,
          hijos: req.body.hijos
        });
        try {
          const newpadre = await padre.save();
          console.log(newpadre)
        } catch (err) {
          res.status(400).json({ message: err.message });
        }
      }
  }

    //--------------------
    const usuarioGuardado = await nuevoUsuario.save();
    const token = jwt.sign({id:usuarioGuardado._id},"instituto-api",{
      expiresIn:86400 
    });
    
    res.json({token});
  },
  signIn: async (req, res) => {
    const buscarUsuario = await Usuario.findOne({Email: req.body.email}).populate("Roles")
    if(!buscarUsuario) return res.status(404).json({message:"Usuario no encontrado"})

    const compararContraseña = await Usuario.compararContraseña(req.body.password,buscarUsuario.Password)

    if(!compararContraseña) return res.status(401).json({token:null,message:'Contraseña invalida'})
    const token = jwt.sign({id:buscarUsuario._id}, "instituto-api",{
      expiresIn: 86400
    })
    res.json({token})
  },
 
};