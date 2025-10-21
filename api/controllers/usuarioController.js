import usuarioService from "../services/usuarioService.js";
import { ObjectId } from "mongodb";

const getAllUsuarios = async (req, res) => {
  try {
    const usuarios = await usuarioService.getAll();
    res.status(200).json({ usuarios: usuarios });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

const createUsuario = async (req, res) => {
  try {
    const { 
      nome, 
      nomeUsuario, 
      emailUsuario, 
      senhaUsuario, 
      permissao,
    } = req.body;    
    await usuarioService.Create({
      nome,
      nomeUsuario,
      emailUsuario,
      senhaUsuario,
      permissao,
    });
    res.sendStatus(201);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
};

const deleteUsuario = async (req, res) => {
  try {
    if (ObjectId.isValid(req.params.id)) { 
      const id = req.params.id;
      await usuarioService.Delete(id);
      res.sendStatus(204);
    } else {
      res.status(400).json({ error: "A ID enviada é invalida" });
    } 
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

const updateUsuario = async (req, res) => {
  try {
    if (ObjectId.isValid(req.params.id)) { 
      const id = req.params.id;
      const { 
        nome,
        nomeUsuario,
        emailUsuario,
        senhaUsuario,
        permissao,
      } = req.body;
      await usuarioService.Update(id, {
        nome,
        nomeUsuario,
        emailUsuario,
        senhaUsuario,
        permissao,
      });
      res.sendStatus(204);
    } else {
      res.status(400).json({ error: "A ID enviada é invalida" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Erro interno do servidor" });
  } 
};

const getOneUsuario = async (req, res) => {
  try {
    if (ObjectId.isValid(req.params.id)) {
      const id = req.params.id;
      const usuario = await usuarioService.getOne(id);
      if(!usuario){
        res.status(404).json({ error: "Usuario não encontrado" });
      } else {
        res.status(200).json({ usuario });
      }
  } else {
      res.status(400).json({ error: "A ID enviada é invalida" });
  }
} catch (error) {
    console.log(error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

export default {getAllUsuarios, createUsuario, deleteUsuario, updateUsuario, getOneUsuario};
