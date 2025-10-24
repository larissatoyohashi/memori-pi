import mongoose from "mongoose";

const usuariosSchema = new mongoose.Schema({
    nome: String,
    nomeUsuario: String,
    emailUsuario: String,
    senhaUsuario: String,
    permissao: {
        type: Boolean,    
        required: true,    
        default: false  
    }
});
const Usuarios = mongoose.model("Usuarios", usuariosSchema);
export default Usuarios;