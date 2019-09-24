const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const os = require('os')

const Usuario = require('../models/usuario');
const clientRCP = require('../utils/client');
const { verificarToken, verificarAdmin_Role } = require('../middlewares/authenticacion');
const log = require('../utils/log');


const app = express();

log.useLog(app);



app.get('/usuario', [], (req, res) => {

    let estadoUsr = req.query.estado; // yo aumente para que funcione 
    if (!estadoUsr) { // el filtro de estado 
        estadoUsr = true;
    }
    //estadoUsr = Boolean(estadoUsr);

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Usuario.find({ estado: estadoUsr }, 'nickname name estado kudosQty')
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {

            if (err) {
                res.status(400).json({
                    ok: false,
                    err
                });
            }

            Usuario.count({ estado: estadoUsr }, (err, conteo) => {
                    res.json({
                        ok: true,
                        usuarios,
                        total: conteo,
                        estadoUsr
                    });

                }).skip(desde)
                .limit(limite)

        });
});

app.get('/usuario/:id', [], function(req, res) {

    let id = req.params.id;
    
    Usuario.findById(id, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            });
        }
        clientRCP.getKudos(usuarioDB.nickname).then(r => {
            console.log(`result: ${r.toString()}`);
            res.json({
                ok: true,
                usuario: usuarioDB,
                Kudos: JSON.parse(r)
            });
        });

    });

});


app.post('/usuario/nick', [], function(req, res) {

    let nickname = req.body.nickname;
    console.log("***********")
    console.log(nickname)

    Usuario.find({ nickname: nickname }, 'id nickname name estado kudosQty')
    .exec((err, usuario) => {

        if (err) {
            res.status(400).json({
                ok: false,
                err
            });
        } else {
            res.json({
                id:usuario[0]._id,
            });
        }
        

   

    });

});

// [verificarToken, verificarAdmin_Role]

app.post('/usuario', [], function(req, res) {

    let body = req.body;

    let usuario = new Usuario({
        nickname: body.nickname,
        name: body.name,
        password: bcrypt.hashSync(body.password, 10),
        kudosQty: 0
    });

    usuario.save((err, usuarioDB) => {
        if (err) {
            res.status(400).json({
                ok: false,
                err
            });
        }

        //usuarioDB.password = '_'; // para no mandar el pass como respuesta

        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });

});



app.put('/usuario/:id', [], function(req, res) {
    let id = req.params.id;
    let body = _.pick(req.body, ['kudosQty']);
    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true, context: 'query' }, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });

});



app.delete('/usuario/:id', [], function(req, res) {

    let id = req.params.id;
    let cambiaEstado = {
        estado: false
    }

    Usuario.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, usuarioBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            });
        }

        // res.json({
        //     ok: true,
        //     usuario: usuarioBorrado
        // });

        clientRCP.delKudos(usuarioBorrado.nickname).then(r => {
            console.log(`result: ${r.toString()}`);
            res.json({
                ok: true,
                usuario: usuarioBorrado
            });
        });

    });

});

module.exports = app;