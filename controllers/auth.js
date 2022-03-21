const { response } = require('express');
const Usuario = require('../models/usuario');
const bcryptjs = require('bcryptjs');
const { generarJWT } = require('../helpers/generar-jwt');
const { googleVerify } = require('../helpers/google-verify');


const login = async (req, res = response) => {

    const { correo, password } = req.body;

    try {

        //Verificar si el email existe
        const usuario = await Usuario.findOne({ correo });

        if(!usuario){
            return res.status(400).json({
                msg: 'Usuario / password no son correctas'
            })
        }

        //SI el usuario esta activo 
        if(!usuario.estado){
            return res.status(400).json({
                msg: 'Usuario / password no son correctas - estado: false'
            })
        }

        //Verificar la contraseña
        const validPassword = bcryptjs.compareSync(password, usuario.password);

        if(!validPassword){
            return res.status(400).json({
                msg: 'Usuario / password no son correctas - password'
            })
        }


        //generar el JWT
        const token = await generarJWT( usuario.id);


        res.json({
            usuario,
            token
        })

    } catch(error){

        console.log(error)
        return res.status(500).json({
            msg : 'Hable con el administrador'
        })
    }
}

const googleSignIn = async ( req, res = response) => {

    const { id_token } = req.body;

    try {
        const { name, picture, email } = await googleVerify( id_token );

        let usuario = await Usuario.findOne({ correo : email})

        if( !usuario ) {
            const data = {
                nombre: name,
                correo: email,
                password: ':P',
                img: picture,
                google: true,
                rol: 'USER_ROLE'
            };

            usuario = new Usuario( data );
            await usuario.save();
        }

        if( !usuario.estado ){
            return res.status(401).json({
                msg: 'user blocked'
            })
        }

        const token = await generarJWT( usuario.id);

        res.json({
           usuario,
           token
        })
    } catch(error){
        console.log(error)
        res.status(400).json({
            ok: false,
            msg: 'token cannot be verified',
        })
    }
}

module.exports = {
    login,
    googleSignIn
}