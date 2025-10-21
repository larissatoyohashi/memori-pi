import { useState, useEffect } from 'react';
import style from "@/components/ConsultarCheckpoints/ConsultarCheckpoints.module.css";


const rotasExistentes = [
    {
        nome: "Museu da Imigração Japonesa"
    },
    {
        nome: "KKKK"
    },
    {
        nome: "MASP"
    }
];

const ConsultarCheckpoints = () => {
    
    const [capaCheckpointFileName, setcapaCheckpointFileName] = useState('');

    const handlecapaCheckpointFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setcapaCheckpointFileName(e.target.files[0].name);
        } else {
            setcapaCheckpointFileName('');
        }
    };

    const handleClick = () => {
        alert("Função de back-end não implementada (MVP).");
    };

    
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');

    const [rotaSelecionada, setRotaSelecionada] = useState('');

    return(
        <>
        
    <div className={style.wrapperCheckpoints}> 

{/* Formulário de Cadastro de Checkpoints */}

        <div className={style.formCheckpoints}>
            
                <p className={style.formTitle}>Cadastro de Checkpoints</p> 

            <form action="#" className={style.cadastroCheckpoints}>
                 <div className={style.inputWrapper}>
                    <input type = "text" placeholder="Título do Checkpoint" className={style.inputField}/>
                </div>

                 <div className={style.inputWrapper}>
                    <input type = "text" placeholder="Descrição do Checkpoint" className={style.inputField}/>
                </div> 

               <div className={style.inputWrapper}>
                            <select 
                                className={style.inputField} 
                                value={rotaSelecionada}
                                onChange={(e) => setRotaSelecionada(e.target.value)}
                                required
                            >
                                <option value="" disabled>Selecione uma rota</option>
                                
                                {rotasExistentes.map((rota) => (
                                    <option key={rota.nome} value={rota.nome}>
                                        {rota.nome}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className={style.inputWrapper}>
                            <input 
                                type="number" 
                                step="any" 
                                min="-90" 
                                max="90"  
                                placeholder="Latitude (ex: -23.5505)" 
                                className={style.inputField}
                                value={latitude}
                                onChange={(e) => setLatitude(e.target.value)}
                            />
                        </div>

                       
                        <div className={style.inputWrapper}>
                            <input 
                                type="number" 
                                step="any"
                                min="-180" 
                                max="180"  
                                placeholder="Longitude (ex: -46.6333)" 
                                className={style.inputField}
                                value={longitude}
                                onChange={(e) => setLongitude(e.target.value)}
                            />
                        </div>
                        
                        <div className={style.inputWrapper}>
                            <label htmlFor="upload-capaCheckpoint" className={style.uploadButton}>
                                {capaCheckpointFileName ? `Capa: ${capaCheckpointFileName}` : 'Upload de capa do checkpoint'}
                            </label>
                            <input 
                                id="upload-capaCheckpoint"
                                type="file"  
                                accept="image/*"
                                className={style.hiddenInput}
                                onChange={handlecapaCheckpointFileChange}
                            />
                        </div> 
                        
                        <button>Cadastrar</button>

            </form>
        </div>

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
                
                    <tr>
                        <td data-label="Id">01</td>
                        <td>
                            <img 
                                src="/logo_quadrado.png" 
                                className={style.tableImage} 
                            />
                        </td>
                        <td data-label="Título">Rota das Flores</td>
                        <td data-label="Descrição">Um belo passeio pelos campos floridos da cidade.</td>
                        <td data-label="Rota">KKKK</td>
                        <td data-label="Latitude">-22.6375</td>
                        <td data-label="Longitude">-47.0569</td>
                        <td data-label="Ações"> 

                            <button onClick={handleClick} className={`${style.actionButton} ${style.editarButton}`}>
                                Editar
                            </button>
                            <button onClick={handleClick} className={`${style.actionButton} ${style.excluirButton}`}>
                                Excluir
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>  
        </div>
    </div> 
    </>
    )

    
}

export default ConsultarCheckpoints;