import express from "express";
const modelagemRoutes = express.Router();
import modelagemController from "../controllers/modelagemController.js";

// import Auth from "../middleware/Auth.js";

modelagemRoutes.get("/modelagens", modelagemController.getAllModelagens);
modelagemRoutes.post("/modelagens", modelagemController.createModelagem);
modelagemRoutes.delete("/modelagens/:id", modelagemController.deleteModelagem);
modelagemRoutes.put("/modelagens/:id", modelagemController.updateModelagem);
modelagemRoutes.get("/modelagens/:id", modelagemController.getOneModelagem);

export default modelagemRoutes;