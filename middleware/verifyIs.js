const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');
const Role = require('../models/Roles');
const Alumno = require('../models/alumno');
const Padre = require('../models/padre');

const verifyToken = async(req,res,next)=>{
    try{let token = req.headers['token'] || req.headers['authorization'];
    if (!token) return res.status(403).json({message: "No se ha recibido ningun token"})
    if(token.startsWith('Bearer ')){
      token = token.slice(7,token.length);
    }
    const decoded = jwt.verify(token,"instituto-api")
    req.id = decoded.id;
    const Usuar = await Usuario.findById(req.id,{password:0})
    if (!Usuar) return res.status(403).json({message: "No se ha encontrado usuario"})

    next()}
    catch(error){
        return res.status(403).json({message: "No autorizado"})
    }
    
}


  
module.exports = { verifyToken};