const role = require('../models/Roles');

const createRoles = async ()=> {
    try{
    const count = await role.estimatedDocumentCount()
    if(count>0) return;

    const values = await Promise.all([
        new role ({Rol:'Alumno'}).save(),
        new role ({Rol:'Padre'}).save(),
        new role ({Rol:'Profesor'}).save()
    ])
    console.log(values);
    }
    catch(error){
        console.error(error);
    };
    

}
module.exports = createRoles;