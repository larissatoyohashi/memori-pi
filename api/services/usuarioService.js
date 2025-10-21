import Usuarios from "../models/Usuarios.js";

class UsuariosService {
    async getAll() {
        try {
            const Usuarioss = await Usuarios.find();
            return Usuarioss;
        } catch (error) {
            console.log(error);
        }   
    }

    async Create(   
        nome,
        nomeUsuario,
        emailUsuario,
        senhaUsuario,
        permissao
    ) { 
        try {
            const newUsuario = new Usuarios({
                nome,   
                nomeUsuario,
                emailUsuario,
                senhaUsuario,
                permissao,
            });
            await newUsuario.save();
        } catch (error) {
            console.log(error);
        }       
    }

    async Delete(id) {
        try {
            await Usuarios.findByIdAndDelete(id);   
            console.log(`Usuario com id ${id} deletada com sucesso!`);
        } catch (error) {
            console.log(error);
        }
    }

    async getOne(id) {
        try {
            const Usuarios = await Usuarios.findOne({ _id: id });    
            return Usuarios;
        } catch (error) {
            console.log(error);
        }
    }
}

export default new UsuariosService();
