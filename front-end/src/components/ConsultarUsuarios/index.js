import { useState, useEffect, useRef } from 'react'; // Adicionado useRef
import style from "@/components/ConsultarUsuarios/ConsultarUsuarios.module.css";
import { getUsuarios, createUsuario, deleteUsuario, updateUsuario } from '@/services/api';


const ConsultarUsuarios = () => {

    // --- Estados do Formulário ---
    const [nome, setNome] = useState('');
    const [nomeUsuario, setNomeUsuario] = useState('');
    const [emailUsuario, setEmailUsuario] = useState('');
    const [senhaUsuario, setSenhaUsuario] = useState(''); // Senha só será enviada se preenchida na edição
    const [isAdminForm, setIsAdminForm] = useState(false);

    // --- Estado da Tabela ---
    const [usuarios, setUsuarios] = useState([]);

    // --- NOVO: Estado para controlar Edição ---
    const [idParaEditar, setIdParaEditar] = useState(null); // null = Criando, ID = Editando

    // Ref para o formulário para scroll
    const formRef = useRef(null);

    // --- Busca Inicial ---
    useEffect(() => {fetchUsuarios();}, []);

    // --- Funções de API ---
    const fetchUsuarios = async () => {
        try {
            const response = await getUsuarios();
            setUsuarios(response.data.usuarios || []);
        } catch (error) {
            console.error("Erro no fetchUsuarios:", error);
            alert("Não foi possível carregar os usuários.");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Tem certeza que deseja excluir este usuário?")) {
            return;
        }
        try {
            const response = await deleteUsuario(id);
            if (response.status === 204) {
                alert("Usuário excluído com sucesso!");
                // Se o usuário excluído era o que estava sendo editado, cancela a edição
                if (id === idParaEditar) {
                    clearForm();
                }
                fetchUsuarios();
            }
        } catch (error) {
            console.error("Erro no handleDelete:", error);
            const errorMsg = error.response?.data?.error || "Erro ao excluir usuário";
            alert(`Erro: ${errorMsg}`);
        }
    };

    // --- FUNÇÃO handleEditClick IMPLEMENTADA ---
    const handleEditClick = (usuario) => {
        console.log("Editando usuário:", usuario);
        setIdParaEditar(usuario._id); // Entra no modo de edição
        // Preenche o formulário com os dados do usuário
        setNome(usuario.nome || '');
        setNomeUsuario(usuario.nomeUsuario || '');
        setEmailUsuario(usuario.emailUsuario || '');
        setSenhaUsuario(''); // *** NÃO preenche a senha ***
        setIsAdminForm(!!usuario.permissao); // Define o estado do switch

        // Rola a página para o formulário (opcional)
        formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    // --- clearForm ATUALIZADO ---
    const clearForm = () => {
        setNome('');
        setNomeUsuario('');
        setEmailUsuario('');
        setSenhaUsuario('');
        setIsAdminForm(false);
        setIdParaEditar(null); // <<< Sai do modo de edição
    };

    // --- NOVA FUNÇÃO: Cancelar Edição ---
    const handleCancelEdit = () => {
        clearForm(); // Limpa o formulário e sai do modo de edição
    };

    // --- handleSubmit ATUALIZADO ---
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Monta o objeto base com os dados comuns
        const dadosUsuario = {
            nome: nome,
            nomeUsuario: nomeUsuario,
            emailUsuario: emailUsuario,
            permissao: isAdminForm
        };

        // --- Lógica de Criação vs Atualização ---
        if (idParaEditar) {
            // --- ATUALIZANDO ---
            console.log("Enviando atualização para ID:", idParaEditar);
            // Adiciona a senha APENAS se o usuário digitou algo
            if (senhaUsuario) {
                dadosUsuario.senhaUsuario = senhaUsuario; // LEMBRE-SE DO HASHING no backend!
                console.log("Senha será atualizada.");
            } else {
                 console.log("Senha NÃO será atualizada.");
            }

            try {
                // Chama a API de UPDATE
                const response = await updateUsuario(idParaEditar, dadosUsuario);
                if (response.status === 200) { // Update bem-sucedido
                    alert("Usuário atualizado com sucesso!");
                    clearForm(); // Limpa e sai do modo de edição
                    fetchUsuarios(); // Atualiza a tabela
                }
            } catch (error) {
                console.error("Erro no handleSubmit (Update):", error);
                const errorMsg = error.response?.data?.error || "Erro ao atualizar usuário";
                alert(`Erro: ${errorMsg}`);
                // Não limpa o form em caso de erro na atualização
            }

        } else {
            // --- CRIANDO ---
            console.log("Enviando criação de novo usuário.");
            // Adiciona a senha (obrigatória na criação)
            dadosUsuario.senhaUsuario = senhaUsuario; // LEMBRE-SE DO HASHING no backend!

            try {
                // Chama a API de CREATE
                const response = await createUsuario(dadosUsuario);
                if (response.status === 201) { // Criação bem-sucedida
                    alert("Usuário cadastrado com sucesso!");
                    clearForm();
                    fetchUsuarios();
                }
            } catch (error) {
                console.error("Erro no handleSubmit (Create):", error);
                const errorMsg = error.response?.data?.error || "Erro ao cadastrar usuário";
                alert(`Erro: ${errorMsg}`);
            }
        }
    };


    return(
        <>
        {/* Adiciona a ref ao wrapper principal para scroll */}
        <div ref={formRef} className={style.wrapperUsuarios}>

            {/* Formulário de Cadastro/Edição de Usuarios */}
            <div className={style.formUsuarios}>

                {/* Título dinâmico */}
                <p className={style.formTitle}>
                    {idParaEditar ? 'Editando Usuário' : 'Cadastro de Usuários'}
                </p>

                <form onSubmit={handleSubmit} className={style.cadastroUsuarios}>
                    {/* Input Nome */}
                    <div className={style.inputWrapper}>
                        <input
                            type="text"
                            placeholder="Nome completo"
                            className={style.inputField}
                            value={nome}
                            onChange={(e) => setNome(e.target.value)} required
                        />
                         {/* Ícone SVG */}
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="FF6B6B"><path d="M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-240v-32q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v32q0 33-23.5 56.5T720-160H240q-33 0-56.5-23.5T160-240Zm80 0h480v-32q0-11-5.5-20T700-306q-54-27-109-40.5T480-360q-56 0-111 13.5T260-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T560-640q0-33-23.5-56.5T480-720q-33 0-56.5 23.5T400-640q0 33 23.5 56.5T480-560Zm0-80Zm0 400Z"/></svg>
                    </div>

                    {/* Input Nome de Usuário */}
                    <div className={style.inputWrapper}>
                        <input
                            type="text"
                            placeholder="Nome de Usuário"
                            className={style.inputField}
                            value={nomeUsuario}
                            onChange={(e) => setNomeUsuario(e.target.value)} required
                        />
                        {/* Ícone SVG */}
                         <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="FF6B6B"><path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480v58q0 59-40.5 100.5T740-280q-35 0-66-15t-52-43q-29 29-65.5 43.5T480-280q-83 0-141.5-58.5T280-480q0-83 58.5-141.5T480-680q83 0 141.5 58.5T680-480v58q0 26 17 44t43 18q26 0 43-18t17-44v-58q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93h160q17 0 28.5 11.5T680-120q0 17-11.5 28.5T640-80H480Zm0-280q50 0 85-35t35-85q0-50-35-85t-85-35q-50 0-85 35t-35 85q0 50 35 85t85 35Z"/></svg>
                    </div>

                    {/* Input E-mail */}
                    <div className={style.inputWrapper}>
                        <input
                            type="email" // Correto usar type="email"
                            placeholder="E-mail"
                            className={style.inputField}
                            value={emailUsuario}
                            onChange={(e) => setEmailUsuario(e.target.value)} required
                        />
                         {/* Ícone SVG */}
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="FF6B6B" ><path d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Zm640-480L501-453q-5 3-10.5 4.5T480-447q-5 0-10.5-1.5T459-453L160-640v400h640v-400ZM480-520l320-200H160l320 200ZM160-640v10-59 1-32 32-.5 58.5-10 400-400Z"/></svg>
                    </div>

                    {/* Input Senha (Opcional na edição) */}
                    <div className={style.inputWrapper}>
                        <input
                            type="password"
                            // Placeholder dinâmico
                            placeholder={idParaEditar ? "Nova Senha (deixe em branco para manter)" : "Senha"}
                            className={style.inputField}
                            value={senhaUsuario}
                            onChange={(e) => setSenhaUsuario(e.target.value)}
                            // Required apenas se NÃO estiver editando
                            required={!idParaEditar}
                        />
                         {/* Ícone SVG */}
                         <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="FF6B6B"><path d="M240-80q-33 0-56.5-23.5T160-160v-400q0-33 23.5-56.5T240-640h40v-80q0-83 58.5-141.5T480-920q83 0 141.5 58.5T680-720v80h40q33 0 56.5 23.5T800-560v400q0 33-23.5 56.5T720-80H240Zm0-80h480v-400H240v400Zm240-120q33 0 56.5-23.5T560-360q0-33-23.5-56.5T480-440q-33 0-56.5 23.5T400-360q0 33 23.5 56.5T480-280ZM360-640h240v-80q0-50-35-85t-85-35q-50 0-85 35t-35 85v80ZM240-160v-400 400Z"/></svg>
                    </div>

                    {/* Switch de Permissão */}
                    <div className={style.switchWrapper}>
                        <span className={style.switchLabel}>Permissão:</span>
                        <label className={style.switch}>
                            <input
                                type="checkbox"
                                checked={isAdminForm}
                                onChange={() => setIsAdminForm(!isAdminForm)}
                            />
                            <span className={style.slider}></span>
                        </label>
                        <span className={`${style.switchStatus} ${isAdminForm ? style.adminStatus : ''}`}>
                            {isAdminForm ? 'Administrador' : 'Usuário Padrão'}
                        </span>
                    </div>

                    {/* Botão Submit (Texto Dinâmico) */}
                    <button type="submit" className={style.submitButton}>
                        {idParaEditar ? 'Atualizar Usuário' : 'Cadastrar'}
                    </button>

                    {/* Botão Cancelar Edição (Condicional) */}
                    {idParaEditar && (
                        <button
                            type="button" // Previne submit
                            onClick={handleCancelEdit}
                            // Reutiliza estilo ou cria um novo (ex: style.cancelButton)
                            className={style.submitButton}
                            style={{ marginTop: '10px', backgroundColor: '#aaa', borderColor: '#999' }} // Estilo rápido
                        >
                            Cancelar Edição
                        </button>
                    )}
                </form>
            </div>

            {/* Tabela de Usuários */}
            <div className={style.tableContainer}>
               <table className={style.table}>
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Nome</th>
                            <th>Usuário</th>
                            <th>E-mail</th>
                            <th>Permissão</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {usuarios.length > 0 ? (
                            usuarios.map((usuario) => (
                                <tr key={usuario._id}>
                                    <td data-label="Id">{usuario._id.slice(-6)}</td>
                                    <td data-label="Nome">{usuario.nome}</td>
                                    <td data-label="Usuario">{usuario.nomeUsuario}</td>
                                    <td data-label="Email">{usuario.emailUsuario}</td>
                                    <td data-label="Permissao">
                                        {/* Mostra o status baseado no dado real */}
                                        <span className={usuario.permissao ? style.adminStatus : ''}>
                                            {usuario.permissao ? 'Admin' : 'Usuário Padrão'}
                                        </span>
                                        {/* Poderia adicionar o toggle aqui se quisesse editar direto na tabela */}
                                    </td>
                                    <td data-label="Ações">
                                        {/* Botão Editar chama handleEditClick */}
                                        <button onClick={() => handleEditClick(usuario)} className={`${style.actionButton} ${style.editarButton}`}>
                                            Editar
                                        </button>
                                        <button onClick={() => handleDelete(usuario._id)} className={`${style.actionButton} ${style.excluirButton}`}>
                                            Excluir
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" style={{ textAlign: 'center' }}>Nenhum usuário encontrado.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
        </>
    );
}

export default ConsultarUsuarios;