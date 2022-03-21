const { Router } = require('express');
const { check } = require('express-validator');
const { login } = require('../controllers/auth');
const { crearCategoria } = require('../controllers/categorias');
const { validarCampos } = require('../middlewares/validar-campos');

const router = Router();

//Obtener todas las categorias
router.get('/', (req, res) => {
    res.json('get')
});


//Obtener una categoria por id
router.get('/:id', (req, res) => {
    res.json('get - id')
});

//Crear una categoria
router.post('/', [check('nombre', 'El nombre es obligatorio').not().isEmpty(), validarCampos], crearCategoria);

//Actualizar una categoria
router.put('/:id', [check('nombre', 'El nombre es obligatorio').not().isEmpty(), validarCampos], (req, res) => {
    res.json('put')
});

//Borrar una categoria
router.delete('/:id', (req, res) => {
    res.json('delete')
});

module.exports = router;