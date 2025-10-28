import { useState, useEffect, useRef } from 'react'; // Adicionado useRef
import style from "@/components/ConsultarCheckpoints/ConsultarCheckpoints.module.css";

// Importar as funções da sua camada de API, incluindo updateCheckpoint
import { getCheckpoints, createCheckpoint, deleteCheckpoint, getRotas, updateCheckpoint } from '@/services/api';

const ConsultarCheckpoints = () => {

    // --- Estados do Formulário ---
    const [nomeCheckpoint, setNomeCheckpoint] = useState('');
    const [descricaoCheckpoint, setDescricaoCheckpoint] = useState('');
    const [rotaSelecionada, setRotaSelecionada] = useState(''); // Armazena o tituloRota selecionado
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [capaCheckpointFile, setCapaCheckpointFile] = useState(null); // O objeto File
    const [capaCheckpointFileName, setCapaCheckpointFileName] = useState(''); // Nome para exibição

    // --- Estados da Tabela e Dropdown ---
    const [checkpoints, setCheckpoints] = useState([]);
    const [rotas, setRotas] = useState([]);

    // --- NOVO: Estado para Edição ---
    const [idParaEditar, setIdParaEditar] = useState(null); // null = Criando, ID = Editando
    const [nomeCapaAtual, setNomeCapaAtual] = useState(''); // Guarda nome da capa atual durante edição

    // --- Ref para o Formulário ---
    const formRef = useRef(null);

    // --- Efeito para Buscar Dados (GET) ---
    useEffect(() => {
        fetchCheckpoints();
        fetchRotas(); // Continua buscando rotas para o dropdown
    }, []);

    const fetchCheckpoints = async () => {
        try {
            const response = await getCheckpoints();
            setCheckpoints(response.data.checkpoints || []);
        } catch (error) {
            console.error("Erro no fetchCheckpoints:", error);
            alert("Não foi possível carregar os checkpoints.");
        }
    };

    const fetchRotas = async () => {
        try {
            const response = await getRotas();
            setRotas(response.data.rotas || []);
        } catch (error) {
            console.error("Erro no fetchRotas:", error);
            // Pode omitir alerta aqui, apenas logar
        }
    };

    // --- Funções de Manipulação de Eventos ---

    // --- handleEditClick IMPLEMENTADO ---
    const handleEditClick = (checkpoint) => {
        console.log("Editando checkpoint:", checkpoint);
        setIdParaEditar(checkpoint._id); // Define o ID para modo de edição

        // Preenche o formulário com os dados existentes
        setNomeCheckpoint(checkpoint.nomeCheckpoint || '');
        setDescricaoCheckpoint(checkpoint.descricaoCheckpoint || '');
        setRotaSelecionada(checkpoint.tituloRota || ''); // Assume que o campo no checkpoint é tituloRota
        setLatitude(checkpoint.latitudeCheckpoint !== undefined && checkpoint.latitudeCheckpoint !== null ? String(checkpoint.latitudeCheckpoint) : '');
        setLongitude(checkpoint.longitudeCheckpoint !== undefined && checkpoint.longitudeCheckpoint !== null ? String(checkpoint.longitudeCheckpoint) : '');

        // Limpa a seleção de NOVO arquivo
        setCapaCheckpointFile(null);

        // Define o nome do arquivo ATUAL para exibição no label
        // Assumindo que o campo da imagem no checkpoint é 'imagemCheckpoint'
        const currentFilename = checkpoint.imagemCheckpoint ? checkpoint.imagemCheckpoint.split('/').pop() : 'Nenhuma';
        setCapaCheckpointFileName(`Manter: ${currentFilename}`);
        setNomeCapaAtual(currentFilename); // Guarda nome original

        // Opcional: Rola para o formulário
        formRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    // --- clearForm ATUALIZADO ---
    const clearForm = () => {
        setNomeCheckpoint('');
        setDescricaoCheckpoint('');
        setRotaSelecionada('');
        setLatitude('');
        setLongitude('');
        setCapaCheckpointFile(null);
        setCapaCheckpointFileName('');
        setIdParaEditar(null); // <<< Reseta o modo de edição
        setNomeCapaAtual(''); // <<< Reseta nome da capa atual

        // Limpa visualmente o input de arquivo
        const fileInput = document.getElementById('upload-capaCheckpoint');
        if (fileInput) fileInput.value = null;
    };

    // --- NOVA FUNÇÃO: Cancelar Edição ---
    const handleCancelEdit = () => {
        clearForm(); // Limpa e sai do modo de edição
    };

    // --- handlecapaCheckpointFileChange ATUALIZADO ---
    const handlecapaCheckpointFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setCapaCheckpointFile(e.target.files[0]);
            // Mostra nome do NOVO arquivo
            setCapaCheckpointFileName(e.target.files[0].name);
        } else {
            // Se cancelou a seleção, volta a mostrar o nome antigo (se estiver editando)
            setCapaCheckpointFile(null);
            setCapaCheckpointFileName(idParaEditar ? `Manter: ${nomeCapaAtual}` : '');
        }
    };

    // --- Função de Criar/Atualizar (POST/PUT) ---
    const handleSubmit = async (e) => {
        e.preventDefault();

        // 1. Criar o FormData
        const formData = new FormData();

        // 2. Adicionar os campos de texto SEMPRE
        formData.append('nomeCheckpoint', nomeCheckpoint);
        formData.append('descricaoCheckpoint', descricaoCheckpoint);
        formData.append('tituloRota', rotaSelecionada); // Backend espera 'tituloRota'
        formData.append('latitudeCheckpoint', latitude);
        formData.append('longitudeCheckpoint', longitude);

        // --- Lógica de Criação vs Atualização ---
        if (idParaEditar) {
            // --- ATUALIZANDO ---
            console.log("Atualizando Checkpoint ID:", idParaEditar);

            // 3. Adicionar a NOVA imagem SÓ SE selecionada
            if (capaCheckpointFile) {
                console.log("Anexando NOVA capa:", capaCheckpointFileName);
                // Nome 'capaCheckpoint' deve bater com uploadCheckpoint.single('capaCheckpoint')
                formData.append('capaCheckpoint', capaCheckpointFile);
            } else {
                console.log("Mantendo capa existente.");
            }

            try {
                // 4. Chamar a API de UPDATE
                const response = await updateCheckpoint(idParaEditar, formData);
                if (response.status === 200) { // Update bem-sucedido (geralmente 200 OK)
                    alert("Checkpoint atualizado com sucesso!");
                    clearForm(); // Limpa e sai do modo de edição
                    fetchCheckpoints(); // Atualiza a tabela
                }
            } catch (error) {
                console.error("Erro no handleSubmit (Update Checkpoint):", error);
                alert(`Erro ao atualizar checkpoint: ${error.response?.data?.error || "Erro desconhecido"}`);
                // Não limpa o form em caso de erro para permitir correção
            }

        } else {
            // --- CRIANDO ---
            console.log("Criando novo Checkpoint...");

            // 3. Validar e adicionar a imagem (obrigatória na criação)
            if (!capaCheckpointFile) {
                alert("Por favor, selecione uma imagem de capa para cadastrar.");
                return;
            }
            formData.append('capaCheckpoint', capaCheckpointFile);

            try {
                // 4. Chamar a API de CREATE
                const response = await createCheckpoint(formData);
                if (response.status === 201) { // Criação bem-sucedida
                    alert("Checkpoint cadastrado com sucesso!");
                    clearForm();
                    fetchCheckpoints(); // Atualiza a tabela
                }
            } catch (error) {
                console.error("Erro no handleSubmit (Create Checkpoint):", error);
                alert(`Erro ao cadastrar checkpoint: ${error.response?.data?.error || "Erro desconhecido"}`);
            }
        }
    };

    // --- Função de Deletar (DELETE) ---
    const handleDelete = async (id) => {
        if (!window.confirm("Tem certeza que deseja excluir este checkpoint?")) {
            return;
        }

        try {
            // O backend deve cuidar da exclusão do arquivo associado
            const response = await deleteCheckpoint(id);
            if (response.status === 204) {
                alert("Checkpoint excluído com sucesso!");
                 // Se o item excluído era o que estava sendo editado, cancela a edição
                if (id === idParaEditar) {
                    clearForm();
                }
                fetchCheckpoints(); // Atualiza a tabela
            }
        } catch (error) {
            console.error("Erro no handleDelete:", error);
            const errorMsg = error.response?.data?.error || "Erro ao excluir checkpoint";
            alert(`Erro: ${errorMsg}`);
        }
    };


    // --- Renderização JSX ---
    return (
        <>
            {/* Adiciona ref ao wrapper */}
            <div ref={formRef} className={style.wrapperCheckpoints}>
                <div className={style.formCheckpoints}>
                    {/* Título Dinâmico */}
                    <p className={style.formTitle}>
                       {idParaEditar ? `Editando Checkpoint (ID: ...${idParaEditar.slice(-6)})` : 'Cadastro de Checkpoints'}
                    </p>

                    <form onSubmit={handleSubmit} className={style.cadastroCheckpoints}>
                        {/* Input Título */}
                        <div className={style.inputWrapper}>
                            <input
                                type="text"
                                placeholder="Título do Checkpoint"
                                className={style.inputField}
                                value={nomeCheckpoint}
                                onChange={(e) => setNomeCheckpoint(e.target.value)}
                                required
                            />
                        </div>

                        {/* Input Descrição */}
                        <div className={style.inputWrapper}>
                            <input
                                type="text"
                                placeholder="Descrição do Checkpoint"
                                className={style.inputField}
                                value={descricaoCheckpoint}
                                onChange={(e) => setDescricaoCheckpoint(e.target.value)}
                                required
                            />
                        </div>

                        {/* Select de Rotas Dinâmico */}
                        <div className={style.inputWrapper}>
                            <select
                                className={style.inputField}
                                value={rotaSelecionada}
                                onChange={(e) => setRotaSelecionada(e.target.value)}
                                required
                            >
                                <option value="" disabled>Selecione uma rota</option>
                                {rotas.length > 0 ? (
                                    rotas.map((rota) => (
                                        // Usa tituloRota como valor, pois é o que o backend espera
                                        <option key={rota._id} value={rota.tituloRota}>
                                            {rota.tituloRota}
                                        </option>
                                    ))
                                ) : (
                                    <option disabled>Carregando rotas...</option>
                                )}
                            </select>
                        </div>

                         {/* Inputs Latitude/Longitude */}
                        <div className={style.inputWrapper}>
                            <input
                                type="number"
                                step="any"
                                placeholder="Latitude (ex: -23.5505)"
                                className={style.inputField}
                                value={latitude}
                                onChange={(e) => setLatitude(e.target.value)}
                                required
                            />
                        </div>
                        <div className={style.inputWrapper}>
                            <input
                                type="number"
                                step="any"
                                placeholder="Longitude (ex: -46.6333)"
                                className={style.inputField}
                                value={longitude}
                                onChange={(e) => setLongitude(e.target.value)}
                                required
                            />
                        </div>

                        {/* Input de Arquivo (Label dinâmico) */}
                        <div className={style.inputWrapper}>
                            <label htmlFor="upload-capaCheckpoint" className={style.uploadButton}>
                               {capaCheckpointFile ? `Nova Capa: ${capaCheckpointFileName}` : (idParaEditar ? `Capa: ${capaCheckpointFileName}` : 'Upload de capa do checkpoint')}
                            </label>
                            <input
                                id="upload-capaCheckpoint"
                                type="file"
                                accept="image/*"
                                className={style.hiddenInput}
                                onChange={handlecapaCheckpointFileChange}
                                // Required apenas na criação
                                required={!idParaEditar}
                            />
                        </div>

                        {/* Botão Submit (Texto dinâmico) */}
                        <button type="submit" className={style.submitButton}>
                           {idParaEditar ? 'Atualizar Checkpoint' : 'Cadastrar'}
                        </button>

                         {/* Botão Cancelar Edição (Condicional) */}
                         {idParaEditar && (
                            <button
                                type="button" // Previne submit
                                onClick={handleCancelEdit}
                                className={style.submitButton} // Reutiliza estilo ou cria um novo
                                style={{ marginTop: '10px', backgroundColor: '#aaa', borderColor: '#999' }}
                            >
                                Cancelar Edição
                            </button>
                        )}
                    </form>
                </div>

                {/* Tabela */}
                <div className={style.tableContainer}>
                    <table className={style.table}>
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>Imagem</th>
                                <th>Título</th>
                                <th>Descrição</th>
                                <th>Rota</th>
                                <th>Latitude</th>
                                <th>Longitude</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {checkpoints.length > 0 ? (
                                checkpoints.map((checkpoint) => (
                                    <tr key={checkpoint._id}>
                                        <td data-label="Id">{checkpoint._id.slice(-6)}</td>
                                        <td>
                                            <img
                                                // CONFIRME: O campo no DB é 'imagemCheckpoint'?
                                                src={checkpoint.imagemCheckpoint || "/logo_quadrado.png"}
                                                className={style.tableImage}
                                                alt="Capa do Checkpoint"
                                                onError={(e) => e.target.src = "/logo_quadrado.png"}
                                            />
                                        </td>
                                        <td data-label="Título">{checkpoint.nomeCheckpoint}</td>
                                        <td data-label="Descrição">{checkpoint.descricaoCheckpoint}</td>
                                        <td data-label="Rota">{checkpoint.tituloRota}</td>
                                        <td data-label="Latitude">{checkpoint.latitudeCheckpoint}</td>
                                        <td data-label="Longitude">{checkpoint.longitudeCheckpoint}</td>
                                        <td data-label="Ações">
                                            {/* Botão Editar chama handleEditClick */}
                                            <button onClick={() => handleEditClick(checkpoint)} className={`${style.actionButton} ${style.editarButton}`}>
                                                Editar
                                            </button>
                                            <button onClick={() => handleDelete(checkpoint._id)} className={`${style.actionButton} ${style.excluirButton}`}>
                                                Excluir
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="8" style={{ textAlign: 'center' }}>Nenhum checkpoint encontrado.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}

export default ConsultarCheckpoints;