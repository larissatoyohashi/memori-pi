import express from "express";
const modelagemRoutes = express.Router();
import modelagemController from "../controllers/modelagemController.js";
import { uploadModelagem } from "../middleware/multerConfig.js";

modelagemRoutes.get("/", modelagemController.getAllModelagens);
modelagemRoutes.delete("/:id", modelagemController.deleteModelagem);
modelagemRoutes.get("/:id", modelagemController.getOneModelagem);
modelagemRoutes.post("/", uploadModelagem, modelagemController.createModelagem);
modelagemRoutes.put("/:id", uploadModelagem, modelagemController.updateModelagem);

export default modelagemRoutes;