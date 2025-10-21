import express from "express";
const quizzRoutes = express.Router();
import quizzController from "../controllers/quizzController.js";
import Auth from "../middleware/Auth.js";

quizzRoutes.get("/quizzes", quizzController.getAllQuizzes);
quizzRoutes.post("/quizzes", quizzController.createQuizz);
quizzRoutes.delete("/quizzes/:id", quizzController.deleteQuizz);
quizzRoutes.put("/quizzes/:id", quizzController.updateQuizz);
quizzRoutes.get("/quizzes/:id", quizzController.getOneQuizz);

export default quizzRoutes;