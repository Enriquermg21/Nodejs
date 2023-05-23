const role = require('.././modelos/roles');

const createRoles = async ()=> {
    try{
    const count = await role.estimatedDocumentCount()
    if(count>0) return;

    const values = await Promise.all([
        new role ({Rol:'User'}).save(),
        new role ({Rol:'Admin'}).save()
    ])
    console.log(values);
    }
    catch(error){
        console.error(error);
    };
    

}
module.exports = createRoles;