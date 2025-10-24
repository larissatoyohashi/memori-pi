import { useState, useEffect } from 'react';
import style from "@/components/ConsultarQuizzes/ConsultarQuizzes.module.css";
import { getQuizzes, createQuiz, deleteQuiz, getCheckpoints } from '@/services/api';

const ConsultarQuizzes = () => {

   const [pergunta, setPergunta] = useState('');
    const [alternativaA, setAlternativaA] = useState('');
    const [alternativaB, setAlternativaB] = useState('');
    const [alternativaC, setAlternativaC] = useState('');
    const [alternativaD, setAlternativaD] = useState('');
    const [alternativaCorreta, setAlternativaCorreta] = useState('');
    const [checkpointSelecionado, setCheckpointSelecionado] = useState('');
    const [checkpoints, setCheckpoints] = useState([]);
    const [quizzes, setQuizzes] = useState([]);
    
    useEffect(() => {
        fetchQuizzes();
        fetchCheckpoints();
    }, []);

    const handleEditClick = () => {
        alert("Função de back-end não implementada (MVP).");
    }


    const fetchQuizzes = async () => { 
        try {
            const response = await getQuizzes();
            setQuizzes(response.data.quizzes || []); 
        } catch (error) {
            console.error("Erro no fetchQuizzes:", error);
            alert("Não foi possível carregar os quizzes.");
        }
    };

    const fetchCheckpoints = async () => {  
        try {
            const response = await getCheckpoints();
            setCheckpoints(response.data.checkpoints || []); 
        } catch (error) {
            console.error("Erro no fetchCheckpoints:", error);
        }
    };

    const handleDelete = async (id) => { 
        if (!window.confirm("Tem certeza que deseja excluir este quiz?")) { return; }
        try {
            const response = await deleteQuiz(id);
            if (response.status === 204) {
                alert("Quiz excluído com sucesso!");
                fetchQuizzes(); 
            }
        } catch (error) {
            console.error("Erro no handleDelete:", error);
            const errorMsg = error.response?.data?.error || "Erro ao excluir quiz";
            alert(`Erro: ${errorMsg}`);
        }
    };

    const clearForm = () => { 
        setPergunta(''); setAlternativaA(''); setAlternativaB(''); setAlternativaC(''); setAlternativaD('');
        setAlternativaCorreta(''); setCheckpointSelecionado('');
    };

    const handleSubmit = async (e) => { 
        e.preventDefault();
        const novoQuiz = { pergunta, checkpointQuiz: checkpointSelecionado, alternativaA, alternativaB, alternativaC, alternativaD, alternativaCorreta };
        try {
            const response = await createQuiz(novoQuiz);
            if (response.status === 201) {
                alert("Quiz cadastrado com sucesso!"); clearForm(); fetchQuizzes(); 
            }
        } catch (error) {
            console.error("Erro no handleSubmit:", error);
            const errorMsg = error.response?.data?.error || "Erro ao cadastrar quiz";
            alert(`Erro: ${errorMsg}`);
        }
    };
    
    return(
        <>
        
    <div className={style.wrapperQuizzes}> 

{/* Formulário de Cadastro de Quizzes */}

        <div className={style.formQuizzes}>
                <p className={style.formTitle}>Cadastro de Quizzes</p> 

            <form onSubmit={handleSubmit} className={style.cadastroQuizzes}>
                  
                        {/* Adicionamos uma classe extra para o flex layout */}
                        <div className={`${style.inputWrapper} ${style.perguntaWrapper}`}>
                            
                            <input
                                type="text"
                                placeholder="Pergunta"
                                className={`${style.inputField} ${style.perguntaInput}`} 
                                onChange={(e) => setPergunta(e.target.value)} required
                            />

                            <select
                                className={`${style.inputField} ${style.respostaSelect}`} // Reutiliza estilo, classe extra para largura
                                value={alternativaCorreta}
                                onChange={(e) => setAlternativaCorreta(e.target.value)}
                                required
                            >
                                <option value="" disabled>Correta?</option>
                                <option value="A">A</option>
                                <option value="B">B</option>
                                <option value="C">C</option>
                                <option value="D">D</option>
                            </select>
                        </div>
                        {/* --- Fim da Modificação --- */}

                        <div className={style.inputWrapper}>
                            <input type="text" placeholder="Alternativa A" className={style.inputField}
                            onChange={(e) => setAlternativaA(e.target.value)}
                        required />
                        </div>
                        <div className={style.inputWrapper}>
                            <input type="text" placeholder="Alternativa B" className={style.inputField}
                            onChange={(e) => setAlternativaB(e.target.value)}/>
                        </div>
                        <div className={style.inputWrapper}>
                            <input type="text" placeholder="Alternativa C" className={style.inputField}
                             onChange={(e) => setAlternativaC(e.target.value)}
                             />
                        </div>
                        <div className={style.inputWrapper}>
                            <input type="text" placeholder="Alternativa D" className={style.inputField}
                            onChange={(e) => setAlternativaD(e.target.value)}/>
                        </div>

                       <div className={style.inputWrapper}>
                            <select 
                                className={style.inputField} 
                                value={checkpointSelecionado}
                                onChange={(e) => setCheckpointSelecionado(e.target.value)}
                                required
                            >
                                <option value="" disabled>Selecione um checkpoint</option>
                                
                                {checkpoints.length > 0 ? (
                            checkpoints.map((checkpoint) => (
                                <option key={checkpoint._id} value={checkpoint.nomeCheckpoint}>
                                    {checkpoint.nomeCheckpoint}
                                </option>
                            ))
                        ) : (
                            <option disabled>Carregando checkpoints...</option>
                        )}

                            </select>
                            <button type="submit" className={style.submitButton}>Cadastrar</button>
                        </div>   
                    </form>         
        </div>

       <div className={style.tableContainer}>
         <table className={style.table}>
           <thead>
             <tr>
               <th>Id</th>
               <th>Pergunta</th>
               <th>Alternativa A</th>
               <th>Alternativa B</th>
               <th>Alternativa C</th>
               <th>Alternativa D</th>
               <th>Correta</th>
               <th>Checkpoint</th>
               <th>Ações</th>
             </tr>
           </thead>
           <tbody>
             {quizzes.length > 0 ? (
               quizzes.map((quiz) => (
                 <tr key={quiz._id}>
                   <td data-label="Id">{quiz._id.slice(-6)}</td>
                   <td data-label="Pergunta">{quiz.pergunta}</td>
                   <td data-label="Alternativa A">{quiz.alternativaA}</td>
                   <td data-label="Alternativa B">{quiz.alternativaB}</td>
                   <td data-label="Alternativa C">{quiz.alternativaC}</td>
                   <td data-label="Alternativa D">{quiz.alternativaD}</td>
                   <td data-label="Correta">{quiz.alternativaCorreta}</td>
                   <td data-label="Checkpoint">{quiz.checkpointQuiz}</td>
                   <td data-label="Ações">
                     <button onClick={() => handleEditClick(quiz)} className={`${style.actionButton} ${style.editarButton}`}>
                    Editar
                </button>
                     <button onClick={() => handleDelete(quiz._id)} className={`${style.actionButton} ${style.excluirButton}`}>
                       Excluir
                     </button>
                   </td>
                 </tr>
               ))
             ) : (
               <tr>
                 {/* Colspan 9 = Id, Pergunta, A, B, C, D, Correta, Checkpoint, Ações */}
                 <td colSpan="9" style={{ textAlign: 'center' }}>Nenhum quiz encontrado.</td>
               </tr>
             )}
           </tbody>
         </table>
        </div>
      </div>
    </>
  );
}

export default ConsultarQuizzes;