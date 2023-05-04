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


const isProfesor = async(req,res,next)=>{
    const usu = await Usuario.findById(req.id)
    const rol = await Role.find({_id: {$in: usu.Roles}})

    for(let i = 0; i < rol.length; i++){
        if(rol[i].Rol === 'Profesor'){
            next()
            return;
        }
    }
    return res.status(403).json({message: "Requiere el rol de Profesor"})
}
const isPadrecorreo = async (req, res, next) => {
  try {
    const usu = await Usuario.findById(req.id);
    const padre = await Padre.findOne({ correo: usu.Email });
    const arrayhijos = padre.hijos;
    const hijos = [];

    for (let i = 0; i < arrayhijos.length; i++) {
      const hije = arrayhijos[i];
      const alumno = await Alumno.findOne({ _id: hije });
      hijos.push(alumno);
    }
    res.json(hijos)
  } catch (error) {
    next(error);
  }

}
/*
const isPadre = async(req,res,next)=>{
    const usu = await Usuario.findById(req.id)
    const rol = await Role.find({_id: {$in: usu.Roles}})
    for(let i = 0; i < rol.length; i++){
      
      if(rol[i].Rol === 'Padre'){
        const padre = await Padre.findOne({Usuario: usu._id})
        console.log(usu._id)
        if (!padre) {
          return res.status(403).json({message: "No se encontró ningún padre asociado a este usuario"})
        }
        next()
      }
    }
    return res.status(403).json({message: "Requiere el rol de Padre"})
  }
  */
  
  
module.exports = { verifyToken,isProfesor,isPadrecorreo };