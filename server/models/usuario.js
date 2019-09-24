const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol valido'
};

let Schema = mongoose.Schema;

let usuarioSchema = new Schema({
    nickname: {
        type: String,
        required: [true, 'nickname es requerido'],
        unique: [true, 'El nickname ya existe']
    },
    name: {
        type: String,
        required: [true, 'name es requerido']
    },
    password: {
        type: String,
        required: [true, 'La contrasena es obligatoria']
    },
    kudosQty: {
        type: Number
    },
    estado: {
        type: Boolean,
        default: true
    },
});

usuarioSchema.methods.toJSON = function() {

    let user = this;
    let userObject = user.toObject();
    delete userObject.password; // para no devolver el pass en el objeto
    return userObject;

}

usuarioSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser unico' });

module.exports = mongoose.model('Usuario', usuarioSchema);