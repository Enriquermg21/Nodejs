const express = require ("express");
const mongoose = require("mongoose");
const initdb = require('./dbconfig/db')
const AllRutas = require('./routes/AllRutas');
const createRole = require("./Roles/Roles");
const app = express();


//Creacion y escucha de la base de datos
const puerto = process.env.PUERTO || 3005;
app.listen(puerto,() => console.log('El servidor esta ecuchando el puerto '+ puerto));
initdb();

// Configuración del middleware para recibir json
app.use(express.json());

//Se crean los roles si no han sido creados
createRole();

//Ruta principal
app.use("/", AllRutas)
