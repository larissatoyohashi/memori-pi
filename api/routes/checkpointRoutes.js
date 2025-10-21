import express from "express";
const checkpointRoutes = express.Router();
import checkpointController from "../controllers/checkpointController.js";

// import Auth from "../middleware/Auth.js";

checkpointRoutes.get("/checkpoints", checkpointController.getAllCheckpoints);
checkpointRoutes.post("/checkpoints", checkpointController.createCheckpoint);
checkpointRoutes.delete("/checkpoints/:id", checkpointController.deleteCheckpoint);
checkpointRoutes.put("/checkpoints/:id", checkpointController.updateCheckpoint);
checkpointRoutes.get("/checkpoints/:id", checkpointController.getOneCheckpoint);

export default checkpointRoutes;