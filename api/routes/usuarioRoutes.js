import express from 'express';
const usuarioRoutes = express.Router();
import usuarioController from '../controllers/usuarioController.js';  
import Auth from "../middleware/Auth.js";

usuarioRoutes.get('/usuarios', Auth.Authorization, usuarioController.getAllUsuarios);
usuarioRoutes.post('/usuarios', usuarioController.createUsuario);
usuarioRoutes.delete('/usuarios/:id', Auth.Authorization, usuarioController.deleteUsuario);
usuarioRoutes.put('/usuarios/:id', Auth.Authorization, usuarioController.updateUsuario);
usuarioRoutes.get('/usuarios/:id', Auth.Authorization, usuarioController.getOneUsuario);

export default usuarioRoutes;

