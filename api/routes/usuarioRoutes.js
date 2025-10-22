import express from 'express';
const usuarioRoutes = express.Router();
import usuarioController from '../controllers/usuarioController.js';  

usuarioRoutes.get('/', usuarioController.getAllUsuarios);
usuarioRoutes.post('/', usuarioController.createUsuario);
usuarioRoutes.delete('/:id', usuarioController.deleteUsuario);
usuarioRoutes.put('/:id', usuarioController.updateUsuario);
usuarioRoutes.get('/:id', usuarioController.getOneUsuario);
usuarioRoutes.post('/auth', usuarioController.LoginUsuario);

export default usuarioRoutes;

