const mongoose = require("mongoose");

const db_uri = 'mongodb+srv://enriquermg21:5zcLF6CKdi4OdqEK@cluster0.qu92wqz.mongodb.net/Empresa'

module.exports = ()=>{
    const connect = ()=>{
        mongoose.connect(db_uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true
          })
            .then(() => {
              console.log('Conectado a la base de datos');
            })
            .catch((error) => {
              console.log('Error de conexión: ' + error.message);
            });
    }
    connect();
}