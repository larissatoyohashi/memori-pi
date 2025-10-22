import express from 'express';
const rotaRoutes = express.Router();
import rotaController from '../controllers/rotaController.js';

rotaRoutes.get('/', rotaController.getAllRotas);
rotaRoutes.post('/', rotaController.createRota);
rotaRoutes.delete('/:id', rotaController.deleteRota);
rotaRoutes.put('/:id', rotaController.updateRota);
rotaRoutes.get('/:id', rotaController.getOneRota);

export default rotaRoutes;