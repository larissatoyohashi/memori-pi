import express from 'express';
const rotaRoutes = express.Router();
import rotaController from '../controllers/rotaController.js';
import Auth from "../middleware/Auth.js";

rotaRoutes.get('/rotas', Auth.Authorization, rotaController.getAllRotas);
rotaRoutes.post('/rotas', Auth.Authorization, rotaController.createRota);
rotaRoutes.delete('/rotas/:id', Auth.Authorization, rotaController.deleteRota);
rotaRoutes.put('/rotas/:id', Auth.Authorization, rotaController.updateRota);
rotaRoutes.get('/rotas/:id', Auth.Authorization, rotaController.getOneRotas);

export default rotaRoutes;