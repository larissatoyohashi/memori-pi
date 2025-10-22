import rotaService from "../services/rotaService.js";
import { ObjectId } from "mongodb";

const getAllRotas = async (req, res) => {
  try {
    const rotas = await rotaService.getAll();
    res.status(200).json({ rotas:rotas });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

const createRota = async (req, res) => {
  try {
    const {
      tituloRota,
      cidadeLocalizada,
      longitudeRota,
      latituteRota,
      imagemCapa,
      descricaoRota,
    } = req.body;
    await rotaService.Create(
      tituloRota,
      cidadeLocalizada,
      longitudeRota,
      latituteRota,
      imagemCapa,
      descricaoRota,
    );
    res.sendStatus(201);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
};

const deleteRota = async (req, res) => {
  try {
    if (ObjectId.isValid(req.params.id)) {
      const id = req.params.id;
      await rotaService.Delete(id);
      res.sendStatus(204);
    } else {
      res.status(400).json({ error: "A ID enviada é invalida." });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
};

const updateRota = async (req, res) => {
  try {
    if (ObjectId.isValid(req.params.id)) {
      const id = req.params.id;
      const {tituloRota,cidadeLocalizada,longitudeRota,latituteRota,imagemCapa,descricaoRota,} 
      = req.body;
      const rota = await rotaService.Update(
        id,
        tituloRota,
        cidadeLocalizada,
        longitudeRota,
        latituteRota,
        imagemCapa,
        descricaoRota
      );
      res.status(200).json({ rota });
    } else {
      res.status(400).json({ error: "A ID enviada é invalida" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

const getOneRota = async (req, res) => {
  try {
    if (ObjectId.isValid(req.params.id)) {
      const id = req.params.id;
      const rota = await rotaService.getOne(id);
      if (!rota) {
        res.status(400).json({ error: "Rota nao encontrada" });
      } else {
        res.status(200).json({ rota });
      }
    } else {
      res.status(400).json({ error: "A ID enviada é invalida" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

export default {getAllRotas,createRota,deleteRota,updateRota,getOneRota};
