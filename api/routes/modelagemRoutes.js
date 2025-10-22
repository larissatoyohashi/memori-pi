import express from "express";
const modelagemRoutes = express.Router();
import modelagemController from "../controllers/modelagemController.js";

// import Auth from "../middleware/Auth.js";

modelagemRoutes.get("/", modelagemController.getAllModelagens);
modelagemRoutes.post("/", modelagemController.createModelagem);
modelagemRoutes.delete("/:id", modelagemController.deleteModelagem);
modelagemRoutes.put("/:id", modelagemController.updateModelagem);
modelagemRoutes.get("/:id", modelagemController.getOneModelagem);

export default modelagemRoutes;