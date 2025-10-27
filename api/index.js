import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

// Caminhos
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// ---- MIDDLEWARES ----
app.use(cors({ origin: '*' }));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// ---- SERVIR FRONT E ARQUIVOS ESTÁTICOS ----
app.use(express.static(path.join(__dirname, "front")));
app.use(express.static(path.join(__dirname, "public")));
app.use('/modelos', express.static(path.join(__dirname, 'public/modelos')));
app.use('/qrcodes', express.static(path.join(__dirname, 'public/qrcodes')));

// ---- MODELOS ----
import Checkpoint from "./models/Checkpoints.js";
import Modelagend from "./models/Modelagens.js";
import Quizzes from "./models/Quizzes.js";
import Rotas from "./models/Rotas.js";
import Usuarios from "./models/Usuarios.js";

// ---- ROTAS ----
import checkpointRoutes from "./routes/checkpointRoutes.js";
import modelagemRoutes from "./routes/modelagemRoutes.js";
import quizRoutes from "./routes/quizRoutes.js";
import rotaRoutes from "./routes/rotaRoutes.js";
import usuarioRoutes from "./routes/usuarioRoutes.js";

app.use('/api/checkpoint', checkpointRoutes);
app.use('/api/modelagem', modelagemRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/rota', rotaRoutes);
app.use('/api/usuario', usuarioRoutes);

// Iniciando a conexão com o banco de dados do MongoDB
const port = 4000;

mongoose.connect("mongodb://127.0.0.1:27017/api-memori")
  .then(() => {
    console.log('Conectado ao MongoDB com sucesso!');
    app.listen(port, () => {
      console.log(`API rodando em http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error('Erro ao conectar ao MongoDB:', error);
  });
