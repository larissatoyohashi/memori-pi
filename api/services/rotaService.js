import Rotas from "../models/Rotas.js";

class RotasService {
  async getAll() {
    try {
        const rotas = await Rotas.find();
        return rotas;
    } catch (error) {
        console.log(error);
    }
    }

    async Create(
        tituloRota,
        cidadeLocalizada,
        longitudeRota,
        latituteRota,
        imagemCapa,
        descricaoRota
    ) { 
        try {
            const newRotas = new Rotas({
                tituloRota,
                cidadeLocalizada,
                longitudeRota,
                latituteRota,
                imagemCapa,
                descricaoRota
            });
            await newRotas.save();
        } catch (error) {
            console.log(error);
        }   
    }

    async Delete(id) {
        try {
            await Rotas.findByIdAndDelete(id);   
            console.log(`Rotas com id ${id} deletada com sucesso!`);
        } catch (error) {
            console.log(error);
        }
    }

    async getOne(id) {
        try {
            const rota = await Rotas.findOne({ _id: id });
            return rota;
        } catch (error) {
            console.log(error);
        }
    }

    async Update(id, tituloRotas, cidadeLocalizada, longitudeRotas, latituteRotas, imagemCapa, descricaoRotas) {
        try {
            const rota = await Rotas.findByIdAndUpdate(id, {
                tituloRota,
                cidadeLocalizada,
                longitudeRota,
                latituteRota,
                imagemCapa,
                descricaoRota
            }, { new: true });
            return rota;
        } catch (error) {
            console.log(error);
        }
    }
}

export default new RotasService();
