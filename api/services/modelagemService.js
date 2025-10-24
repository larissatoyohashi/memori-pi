import Modelagem from "../models/Modelagens.js";

class modelagemService {
  async getAll() {
    try {
      const modelagens = await Modelagem.find();
      return modelagens;
    } catch (error) {
      console.log(error);
    }
  }

  async Create(nomeModelagem, nomeCidade, arquivoModelagem, arquivoQrCode, nomeCheckpoint) {
    try {
      const newModelagem = new Modelagem({
        nomeModelagem,
        nomeCidade,
        arquivoModelagem, // Path da Pasta
        arquivoQrCode,    // Path do QR Code
        nomeCheckpoint,   // String Simples
      });

      console.log("[SERVICE] Instância Mongoose criada. Tentando salvar...");
      await newModelagem.save(); // <<< O ERRO PODE ESTAR AQUI
      console.log("[SERVICE] Modelagem salva no DB com SUCESSO!"); // <<< ESTE LOG APARECE?

    } catch (error) {
      console.error("!!! [SERVICE] ERRO ao criar/salvar Modelagem !!!");
      console.error("Erro do Mongoose/DB:", error);
      // É crucial re-lançar o erro para o controller saber que falhou
      throw error;
    }
  }


  async Delete(id) {
    try {
      await Modelagem.findByIdAndDelete(id);
      console.log(`Modelagem com id ${id} deletada com sucesso!`);
    } catch (error) {
      console.log(error);
    }
  }

  async Update(id,nomeModelagem,nomeCidade,arquivoModelagem,arquivoQrCode,nomeCheckpoint) {
    try {
      const modelagem = await Modelagem.findByIdAndUpdate(
        id,
        {
          nomeModelagem,
          nomeCidade,
          arquivoModelagem,
          arquivoQrCode,
          nomeCheckpoint,
        },
        { new: true }
      );
      console.log(`Modelagem com id ${id} atualizada com sucesso!`);
      return modelagem;
    } catch (error) {
      console.log(error);
    }
  }

  async getOne(id) {
    try {
      const modelagem = await Modelagem.findOne({ _id: id });
      return modelagem;
    } catch (error) {
      console.log(error);
    }
  }
}
export default new modelagemService();