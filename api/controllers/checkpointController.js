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

// Função para criar um novo Checkpoint
const createCheckpoint = async (req, res) => {
  try {
    const {
      nomeCheckpoint,
      latitudeCheckpoint,
      longitudeCheckpoint,
      tituloRota,
      descricaoCheckpoint,
    } = req.body;
    await checkpointService.Create(
      nomeCheckpoint,
      latitudeCheckpoint,
      longitudeCheckpoint,
      tituloRota,
      descricaoCheckpoint,
    );
    res.sendStatus(201);
  } catch (error) {
    console.log(error);
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

// Funçãpo para atualizar checkpoints
const updateCheckpoint = async (req, res) => {
  try {
    const id = req.params.id;
    if (ObjectId.isValid(id)) {
      const {
        nomeCheckpoint,
        latitudeCheckpoint,
        longitudeCheckpoint,
        tituloRota,
        descricaoCheckpoint,
      } = req.body;
      const checkpoint = await checkpointService.Update(
        id,
        nomeCheckpoint,
        latitudeCheckpoint,
        longitudeCheckpoint,
        tituloRota,
        descricaoCheckpoint
      );
      res.status(200).json({ checkpoint });
    } else {
      res.status(400).json({ error: "A ID enviada é inválida. " })  ;
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Erro interno do servidor. " });
  }
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
