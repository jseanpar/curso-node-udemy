const { response, request } = require('express');
const bcryptjs = require('bcryptjs')

const Usuario = require('../models/usuario');

const usuariosGet = async(req = request, res = response) => {

   const { limite = 5, desde = 0 } = req.query;
   const query = {estado: true};

    const [total, usuarios] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
        .skip(Number(desde))
        .limit(Number(limite))
    ])

    res.json({
     total,
     usuarios
    })
}

const usuariosPost = async(req, res = response) => {

    const {nombre, correo, password, rol} = req.body;
    const usuario = new Usuario({nombre, correo, password, rol});

    //Encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync(password, salt)

    //guardar en DB
    await usuario.save()


    res.json({
        msg: 'post API - controlador',
        usuario
        //nombre,edad
    })
}

const usuariosPut = async(req, res = response) => {

    const {id} = req.params;
    const {_id, password, google, correo, ...resto} = req.body;

    //TODO validar contra base de datos
    if(password){
        //Encriptar la contraseña
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync(password, salt)
    }

    const usuario = await Usuario.findByIdAndUpdate(id, resto)


    res.json({
        msg: 'put API - controlador',
        usuario
    })
}

const usuariosDelete = async(req, res = response) => {

    const {id} = req.params;

    //borrado fisico
    //const usuario = await Usuario.findByIdAndDelete(id)

    //borrado logico
    const usuario = await Usuario.findByIdAndUpdate(id, {estado: false});

    res.json({
        msg: 'delete API - controlador',
        usuario
    })
}

const usuariosPatch = (req, res = response) => {
    res.json({
        msg: 'patch API - controlador'
    })
}

module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosDelete,
    usuariosPatch,
    usuariosPut
}