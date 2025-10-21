import express from "express";
import mongoose from "mongoose";
const app = express();

// Importando para ser criado no banco 
import Checkpoint from "./models/Checkpoints.js"
import Modelagend from "./models/Modelagens.js";
import Quizzes from "./models/Quizzes.js";
import Rotas from "./models/Rotas.js";
import Usuarios from "./models/Usuarios.js";

// importando as rotas
import checkpointRoutes from "./routes/checkpointRoutes.js";
import modelagemRoutes from "./routes/modelagemRoutes.js";
import quizzRoutes from "./routes/quizzRoutes.js";
import rotaRoutes from "./routes/rotaRoutes.js";
import usuarioRoutes from "./routes/usuarioRoutes.js";

// Configurações do Express
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use('/', checkpointRoutes);
app.use('/', modelagemRoutes);
app.use('/', quizzRoutes);
app.use('/', rotaRoutes);
app.use('/', usuarioRoutes);

// Iniciando a conexão com o banco de dados do MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/api-memori")

// Rodando a API na porta 4000
const port = 4000;
app.listen(port, (error) => {
  if (error) {
    console.log(error);
  }
  console.log(`API rodando em http://localhost:${port}.`);
}); 
