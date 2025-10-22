import express from "express";
const checkpointRoutes = express.Router();
import checkpointController from "../controllers/checkpointController.js";

// import Auth from "../middleware/Auth.js";

checkpointRoutes.get("/", checkpointController.getAllCheckpoints);
checkpointRoutes.post("/", checkpointController.createCheckpoint);
checkpointRoutes.delete("/:id", checkpointController.deleteCheckpoint);
checkpointRoutes.put("/:id", checkpointController.updateCheckpoint);
checkpointRoutes.get("/:id", checkpointController.getOneCheckpoint);

export default checkpointRoutes;