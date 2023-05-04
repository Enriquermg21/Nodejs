const express = require ("express");
const mongoose = require("mongoose");
const initdb = require('./dbconfig/db')
const createRole = require("./libs/crearRoles");
const AllRutas = require('./routes/AllRutas');
const app = express();

//swagger
const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerSpec = {
    definition : {
        openapi :"3.0.0",
        info:{
            tittle:"Api Instituto",
            version:"1.0.0"
        },
        servers:[
            {
                url:"http://localhost:3003/"
            }
        ]
    },
    apis:["./controllers/*.js","./routes/autor,routes.js","./crudPadre/crudPadre.js","./Pdf_Html/Pdf_Html.js","./crudAlumno/crudAlumno.js","./crudClases/crudClases.js","./crudCurso/crudCurso.js","./crudProfesor/crudProfesor.js" ]
}
app.use("/api-doc",swaggerUI.serve, swaggerUI.setup(swaggerJsDoc(swaggerSpec)))
app.get("/api-docjson",(req,res)=>{
    res.setHeader('Content-Type','application/json');
    res.send(swaggerSpec);
})

//Creacion y escucha de la base de datos
const puerto = process.env.PUERTO || 3003;
app.listen(puerto,() => console.log('El servidor esta ecuchando el puerto '+ puerto));
initdb();

// Configuración del middleware para recibir json
app.use(express.json());

//Se crean los roles si no han sido creados
createRole();

//Ruta principal
app.use("/", AllRutas)
