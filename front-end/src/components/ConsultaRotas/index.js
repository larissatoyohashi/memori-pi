import { useState, useEffect, useRef } from 'react'; // Adicionado useRef
import style from "@/components/ConsultaRotas/ConsultaRotas.module.css";
// 1. Importar as funções da sua API, incluindo updateRota
import { getRotas, createRota, deleteRota, updateRota } from '@/services/api';

const ConsultaRotas = () => {

    // --- Estados da API do IBGE (Cidades) ---
    const API_CIDADES_SP_URL = 'https://servicodados.ibge.gov.br/api/v1/localidades/estados/35/municipios';
    const [cidades, setCidades] = useState([]);
    const [isLoading, setIsLoading] = useState(true); // Renomeado para isLoadingCities para clareza

    // --- Estados do Formulário ---
    // (Os nomes dos estados são do seu backend service)
    const [tituloRota, setTituloRota] = useState('');
    const [descricaoRota, setDescricaoRota] = useState('');
    const [cidadeLocalizada, setCidadeLocalizada] = useState('');
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');

    // States para o upload de arquivo
    const [capaRotaFile, setCapaRotaFile] = useState(null); // O arquivo em si
    const [capaRotaFileName, setCapaRotaFileName] = useState(''); // O nome do arquivo para exibição

    // --- Estado da Tabela ---
    const [rotas, setRotas] = useState([]);

    // --- NOVO: Estado para Edição ---
    const [idParaEditar, setIdParaEditar] = useState(null); // null = Criando, ID = Editando
    const [nomeCapaAtual, setNomeCapaAtual] = useState(''); // Guarda nome da capa atual durante edição

    // --- Ref para o Formulário ---
    const formRef = useRef(null);

    // --- useEffect para buscar dados (IBGE e API Local) ---
    useEffect(() => {
        // Buscar Cidades do IBGE
        setIsLoading(true); // Usa isLoading aqui
        fetch(API_CIDADES_SP_URL)
            .then(response => response.json())
            .then(data => {
                const cidadesOrdenadas = data.sort((a, b) => a.nome.localeCompare(b.nome));
                setCidades(cidadesOrdenadas);
                setIsLoading(false); // Usa isLoading aqui
            })
            .catch(error => {
                console.error('Erro ao buscar cidades de SP:', error);
                setIsLoading(false); // Usa isLoading aqui
            });

        // Buscar Rotas da nossa API
        fetchRotas();
    }, []);

    // --- Funções da API Local (CRUD) ---

    const fetchRotas = async () => {
        try {
            const response = await getRotas();
            setRotas(response.data.rotas || []);
        } catch (error) {
            console.error("Erro no fetchRotas:", error);
            alert("Não foi possível carregar as rotas.");
        }
    };

    // --- handleEditClick IMPLEMENTADO ---
    const handleEditClick = (rota) => {
        console.log("Editando rota:", rota);
        setIdParaEditar(rota._id); // Define o ID para modo de edição
        // Preenche o formulário
        setTituloRota(rota.tituloRota || '');
        setDescricaoRota(rota.descricaoRota || '');
        setCidadeLocalizada(rota.cidadeLocalizada || '');
        // Garante que latitude/longitude sejam strings para o input
        setLatitude(rota.latitudeRota !== undefined && rota.latitudeRota !== null ? String(rota.latitudeRota) : '');
        setLongitude(rota.longitudeRota !== undefined && rota.longitudeRota !== null ? String(rota.longitudeRota) : '');


        // Limpa a seleção de NOVO arquivo
        setCapaRotaFile(null);

        // Define o nome do arquivo ATUAL para exibição
        const currentFilename = rota.imagemCapa ? rota.imagemCapa.split('/').pop() : 'Nenhuma';
        setCapaRotaFileName(`Manter: ${currentFilename}`);
        setNomeCapaAtual(currentFilename); // Guarda nome original

        // Opcional: Rola para o formulário
        formRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Tem certeza que deseja excluir esta rota?")) {
            return;
        }

        try {
            const response = await deleteRota(id);
            if (response.status === 204) {
                alert("Rota excluída com sucesso!");
                 // Se o item excluído era o que estava sendo editado, cancela a edição
                if (id === idParaEditar) {
                    clearForm();
                }
                fetchRotas();
            }
        } catch (error) {
            console.error("Erro no handleDelete:", error);
            const errorMsg = error.response?.data?.error || "Erro ao excluir rota";
            alert(`Erro: ${errorMsg}`);
        }
    };

    // --- clearForm ATUALIZADO ---
    const clearForm = () => {
        setTituloRota('');
        setDescricaoRota('');
        setCidadeLocalizada('');
        setLatitude('');
        setLongitude('');
        setCapaRotaFile(null);
        setCapaRotaFileName('');
        setIdParaEditar(null); // <<< Reseta modo de edição
        setNomeCapaAtual(''); // <<< Reseta nome da capa atual

        const fileInput = document.getElementById('upload-capaRota');
        if (fileInput) fileInput.value = null;
    };

    // --- NOVA FUNÇÃO: Cancelar Edição ---
    const handleCancelEdit = () => {
        clearForm(); // Limpa e sai do modo de edição
    };

    // --- Manipuladores de Eventos do Formulário ---

    // --- handlecapaRotaFileChange ATUALIZADO ---
    const handlecapaRotaFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setCapaRotaFile(e.target.files[0]);
            // Mostra nome do NOVO arquivo
            setCapaRotaFileName(e.target.files[0].name);
        } else {
            // Se cancelou, volta a mostrar nome antigo (se editando)
            setCapaRotaFile(null);
            setCapaRotaFileName(idParaEditar ? `Manter: ${nomeCapaAtual}` : '');
        }
    };

    // --- handleSubmit ATUALIZADO ---
    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();

        // Adiciona os campos de texto SEMPRE
        formData.append('tituloRota', tituloRota);
        formData.append('descricaoRota', descricaoRota);
        formData.append('cidadeLocalizada', cidadeLocalizada);
        formData.append('latitudeRota', latitude); // Nome esperado pelo backend
        formData.append('longitudeRota', longitude); // Nome esperado pelo backend

        // --- Lógica de Criação vs Atualização ---
        if (idParaEditar) {
            // --- ATUALIZANDO ---
            console.log("Atualizando Rota ID:", idParaEditar);
            // Adiciona a NOVA imagem SÓ SE selecionada
            if (capaRotaFile) {
                console.log("Anexando NOVA capa:", capaRotaFileName);
                // Nome 'capaRota' deve bater com uploadRota.single('capaRota')
                formData.append('capaRota', capaRotaFile);
            } else {
                 console.log("Mantendo capa existente.");
            }

            try {
                // Chama a API de UPDATE
                const response = await updateRota(idParaEditar, formData);
                if (response.status === 200) { // Update bem-sucedido
                    alert("Rota atualizada com sucesso!");
                    clearForm(); // Limpa e sai do modo de edição
                    fetchRotas(); // Atualiza a tabela
                }
            } catch (error) {
                console.error("Erro no handleSubmit (Update Rota):", error);
                alert(`Erro ao atualizar rota: ${error.response?.data?.error || "Erro desconhecido"}`);
            }

        } else {
            // --- CRIANDO ---
            console.log("Criando nova Rota...");
            // Valida se a imagem foi selecionada (obrigatória na criação)
            if (!capaRotaFile) {
                alert("Por favor, selecione uma imagem de capa para cadastrar.");
                return;
            }
            // Adiciona a imagem
            formData.append('capaRota', capaRotaFile);

            try {
                // Chama a API de CREATE
                const response = await createRota(formData);
                if (response.status === 201) { // Criação bem-sucedida
                    alert("Rota cadastrada com sucesso!");
                    clearForm();
                    fetchRotas(); // Atualiza a tabela
                }
            } catch (error) {
                console.error("Erro no handleSubmit (Create Rota):", error);
                alert(`Erro ao cadastrar rota: ${error.response?.data?.error || "Erro desconhecido"}`);
            }
        }
    };

    return(
        <>
            {/* Adiciona ref ao wrapper */}
            <div ref={formRef} className={style.wrapperRotas}>

                {/* Formulário de Cadastro/Edição de Rotas */}
                <div className={style.formRotas}>
                    {/* Título Dinâmico */}
                    <p className={style.formTitle}>
                       {idParaEditar ? `Editando Rota (ID: ...${idParaEditar.slice(-6)})` : 'Cadastro de Rotas'}
                    </p>

                    <form onSubmit={handleSubmit} className={style.cadastroRotas}>
                        {/* Input Título */}
                        <div className={style.inputWrapper}>
                            <input
                                type="text"
                                placeholder="Título da Rota"
                                className={style.inputField}
                                value={tituloRota}
                                onChange={(e) => setTituloRota(e.target.value)}
                                required
                            />
                        </div>

                        {/* Input Descrição */}
                        <div className={style.inputWrapper}>
                            <input
                                type="text"
                                placeholder="Descrição da Rota"
                                className={style.inputField}
                                value={descricaoRota}
                                onChange={(e) => setDescricaoRota(e.target.value)}
                                required
                            />
                        </div>

                        {/* Input de Cidades (do IBGE) */}
                        <div className={style.inputWrapper}>
                            <input
                                type="text"
                                list="cidades-sp-lista"
                                placeholder={isLoading ? "Carregando cidades..." : "Cidade (SP)"}
                                disabled={isLoading}
                                className={style.inputField}
                                value={cidadeLocalizada}
                                onChange={(e) => setCidadeLocalizada(e.target.value)}
                                required
                            />
                            <datalist id="cidades-sp-lista">
                                {cidades.map((cidade) => (
                                    <option key={cidade.id} value={cidade.nome} />
                                ))}
                            </datalist>
                        </div>

                        {/* Inputs de Latitude e Longitude */}
                        <div className={style.inputWrapper}>
                            <input
                                type="number"
                                step="any" // Permite decimais
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
                                step="any" // Permite decimais
                                placeholder="Longitude (ex: -46.6333)"
                                className={style.inputField}
                                value={longitude}
                                onChange={(e) => setLongitude(e.target.value)}
                                required
                            />
                        </div>

                        {/* Input de Upload de Imagem (Label dinâmico) */}
                        <div className={style.inputWrapper}>
                            <label htmlFor="upload-capaRota" className={style.uploadButton}>
                                {/* Mostra nome novo ou instrução manter/trocar */}
                                {capaRotaFile ? `Nova Capa: ${capaRotaFileName}` : (idParaEditar ? `Capa: ${capaRotaFileName}` : 'Upload de capa da Rota')}
                            </label>
                            <input
                                id="upload-capaRota"
                                type="file"
                                accept="image/*"
                                className={style.hiddenInput}
                                onChange={handlecapaRotaFileChange}
                                // Required apenas na criação
                                required={!idParaEditar}
                            />
                        </div>

                        {/* Botão Submit (Texto dinâmico) */}
                        <button type="submit" className={style.submitButton}>
                            {idParaEditar ? 'Atualizar Rota' : 'Cadastrar'}
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

                {/* Tabela Dinâmica */}
                <div className={style.tableContainer}>
                    <table className={style.table}>
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>Imagem</th>
                                <th>Título</th>
                                <th>Descrição</th>
                                <th>Cidade</th>
                                <th>Latitude</th>
                                <th>Longitude</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rotas.length > 0 ? (
                                rotas.map((rota) => (
                                    <tr key={rota._id}>
                                        <td data-label="Id">{rota._id.slice(-6)}</td>
                                        <td>
                                            <img
                                                // Usa o campo 'imagemCapa' do seu backend service
                                                src={rota.imagemCapa || "/logo_quadrado.png"}
                                                className={style.tableImage}
                                                alt="Capa da Rota"
                                                onError={(e) => e.target.src = "/logo_quadrado.png"}
                                            />
                                        </td>
                                        <td data-label="Título">{rota.tituloRota}</td>
                                        <td data-label="Descrição">{rota.descricaoRota}</td>
                                        <td data-label="Cidade">{rota.cidadeLocalizada}</td>
                                        <td data-label="Latitude">{rota.latitudeRota}</td>
                                        <td data-label="Longitude">{rota.longitudeRota}</td>
                                        <td data-label="Ações">
                                            {/* Botão Editar chama handleEditClick */}
                                            <button onClick={() => handleEditClick(rota)} className={`${style.actionButton} ${style.editarButton}`}>
                                                Editar
                                            </button>
                                            <button onClick={() => handleDelete(rota._id)} className={`${style.actionButton} ${style.excluirButton}`}>
                                                Excluir
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="8" style={{ textAlign: 'center' }}>Nenhuma rota encontrada.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}

export default ConsultaRotas;