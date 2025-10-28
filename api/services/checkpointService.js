import Checkpoint from "../models/Checkpoints.js";

class checkpointService {
  async getAll() {
    try {
      const checkpoints = await Checkpoint.find();
      return checkpoints;
    } catch (error) {
      console.log(error);
    }
  }
  
async Create(
  nomeCheckpoint,
  latitudeCheckpoint,
  longitudeCheckpoint,
  tituloRota,
  descricaoCheckpoint,
  imagemCheckpoint,
) {
  try {
    const newCheckpoint = new Checkpoint({
      nomeCheckpoint,
      latitudeCheckpoint,
      longitudeCheckpoint,
      tituloRota,
      descricaoCheckpoint,
      imagemCheckpoint,
    });
    await newCheckpoint.save();
  } catch (error) {
    console.log(error);
  }
}

  async Delete(id) {
    try {
      await Checkpoint.findByIdAndDelete(id);
      console.log(`Checkpoint com id ${id} deletado com sucesso!`);
    } catch (error) {
      console.log(error);
    }
  }

  async Update(
    id,
    nomeCheckpoint,
    latitudeCheckpoint,
    longitudeCheckpoint,
    tituloRota,
    descricaoCheckpoint,
    imagemCheckpoint
  ) {
    try {
      // Monta objeto de atualização apenas com os campos enviados (não sobrescrever com undefined)
      const updateData = {};
      if (nomeCheckpoint !== undefined) updateData.nomeCheckpoint = nomeCheckpoint;
      if (latitudeCheckpoint !== undefined) updateData.latitudeCheckpoint = latitudeCheckpoint;
      if (longitudeCheckpoint !== undefined) updateData.longitudeCheckpoint = longitudeCheckpoint;
      if (tituloRota !== undefined) updateData.tituloRota = tituloRota;
      if (descricaoCheckpoint !== undefined) updateData.descricaoCheckpoint = descricaoCheckpoint;
      // imagemCheckpoint pode ser undefined (não enviar), null (limpar) ou string (novo/antigo path)
      if (imagemCheckpoint !== undefined) updateData.imagemCheckpoint = imagemCheckpoint;

      const checkpoint = await Checkpoint.findByIdAndUpdate(id, updateData, { new: true });

      if (checkpoint) {
        console.log(`Checkpoint com id ${id} atualizado com sucesso!`);
      } else {
        console.log(`Nenhum checkpoint encontrado com id ${id} para atualizar.`);
      }
      return checkpoint;
    } catch (error) {
      console.log(error);
    }
  }

  async getOne(id) {
    try {
      const checkpoint = await Checkpoint.findOne({ _id: id });
      return checkpoint;
    } catch (error) {
      console.log(error);
    }
  }
}

export default new checkpointService();
