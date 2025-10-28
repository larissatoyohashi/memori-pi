import checkpointService from "../services/checkpointService.js"; // Importando o serviço de Checkpoints
import { ObjectId } from "mongodb";

// Função para listar Checkpoints
const getAllCheckpoints = async (req, res) => {
  try {
    const checkpoints = await checkpointService.getAll();
    res.status(200).json({ checkpoints: checkpoints });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

// Função para criar um novo Checkpoint (CORRIGIDA)
const createCheckpoint = async (req, res) => {
  try {
  
  console.log("Recebendo requisição POST para createCheckpoint.");
        console.log("req.body:", req.body); 
        console.log("req.file:", req.file); 


    const {
      nomeCheckpoint,
      latitudeCheckpoint,
      longitudeCheckpoint,
      tituloRota,
      descricaoCheckpoint,
    } = req.body;

      // CORREÇÃO AQUI: Adicione a subpasta '/checkpoints/' ao caminho
    const imagemCheckpoint = req.file ? `/uploads/checkpoints/${req.file.filename}` : null;

    await checkpointService.Create(
      nomeCheckpoint,
      latitudeCheckpoint,
      longitudeCheckpoint,
      tituloRota,
      descricaoCheckpoint,
      imagemCheckpoint
    );
    res.sendStatus(201);
  } catch (error) {
    console.log("Erro no createCheckpoint (controller):", error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
};

// Função para deletar checkpoints
const deleteCheckpoint = async (req, res) => {
  try {
    if (ObjectId.isValid(req.params.id)) {
      const id = req.params.id;
      await checkpointService.Delete(id);
      res.sendStatus(204);
    } else {
      res.status(400).json({ error: "A ID enviada é inválida. " });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
};

// Funçãpo para atualizar checkpoints (CORRIGIDA)
const updateCheckpoint = async (req, res) => {
  try {
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Erro interno do servidor. " });
  }
  const id = req.params.id;

  // valida ID
  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ error: "A ID enviada é inválida." });
  }

  // Campos esperados no body
  const {
    nomeCheckpoint,
    latitudeCheckpoint,
    longitudeCheckpoint,
    tituloRota,
    descricaoCheckpoint,
  } = req.body;

    // imagem existente ou arquivo novo
    let imagemCheckpoint;
    if (req.file) {
      // novo arquivo enviado
      imagemCheckpoint = `/uploads/checkpoints/${req.file.filename}`;
    } else if (req.body.imagem_existente !== undefined && req.body.imagem_existente !== "") {
      // frontend informou a imagem existente (path) — manter
      imagemCheckpoint = req.body.imagem_existente;
    } else {
      // nenhum dado de imagem enviado => deixar como undefined para NÃO sobrescrever no DB
      imagemCheckpoint = undefined;
    }

  console.log("updateCheckpoint -> id:", id);
  console.log("updateCheckpoint -> body:", req.body);
  console.log("updateCheckpoint -> file:", req.file);

  const checkpoint = await checkpointService.Update(
    id,
    nomeCheckpoint,
    latitudeCheckpoint,
    longitudeCheckpoint,
    tituloRota,
    descricaoCheckpoint,
    imagemCheckpoint
  );

  if (!checkpoint) {
    return res.status(404).json({ error: "Checkpoint não encontrado." });
  }

  res.status(200).json({ checkpoint });
};

// Função buscar um único Checkpoint
const getOneCheckpoint = async (req, res) => {
  try {
    if (ObjectId.isValid(req.params.id)) {
      const id = req.params.id;
      const checkpoint = await checkpointService.getOne(id);
      if (!checkpoint) {
        res.status(404).json({ error: "Checkpoint não encontrado." });
      } else {
        res.status(200).json({ checkpoint });
      }
    } else {
      res.status(400).json({ error: "A ID enviada é inválida. " });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Erro interno do servidor ." });
  }
};

export default {
  getAllCheckpoints,
  createCheckpoint,
  deleteCheckpoint,
  updateCheckpoint,
  getOneCheckpoint,
};
