import { useState, useEffect } from 'react';
import style from "@/components/ConsultaRotas/ConsultaRotas.module.css";


const ConsultaRotas = () => {

    const API_CIDADES_SP_URL = 'https://servicodados.ibge.gov.br/api/v1/localidades/estados/35/municipios';
    const [cidades, setCidades] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const handleClick = () => {
        alert("Função de back-end não implementada (MVP).");
    };

    const [capaRotaFileName, setcapaRotaFileName] = useState('');

    const handlecapaRotaFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setcapaRotaFileName(e.target.files[0].name);
        } else {
            setcapaRotaFileName('');
        }
    };

    useEffect(() => {
        setIsLoading(true);
        fetch(API_CIDADES_SP_URL)
            .then(response => response.json())
            .then(data => {
               
                const cidadesOrdenadas = data.sort((a, b) => a.nome.localeCompare(b.nome));
                setCidades(cidadesOrdenadas);
                setIsLoading(false);
            })
            .catch(error => {
                console.error('Erro ao buscar cidades de SP:', error);
                setIsLoading(false);
            });
    }, []); 

    return(
        <>
        
    <div className={style.wrapperRotas}> 

{/* Formulário de Cadastro de Rotas */}

        <div className={style.formRotas}>
            
                <p className={style.formTitle}>Cadastro de Rotas</p> 

            <form action="#" className={style.cadastroRotas}>
                 <div className={style.inputWrapper}>
                    <input type = "text" placeholder="Título da Rota" className={style.inputField}/>
                </div>

                 <div className={style.inputWrapper}>
                    <input type = "text" placeholder="Descrição da Rota" className={style.inputField}/>
                </div> 

                <div className={style.inputWrapper}>
                            <input
                                type="text"
                                list="cidades-sp-lista" 
                                placeholder={isLoading ? "Carregando cidades..." : "Cidade (SP)"}
                                disabled={isLoading}
                                className={style.inputField} 
                            />
                            <datalist id="cidades-sp-lista">
                                {cidades.map((cidade) => (
                                    <option key={cidade.id} value={cidade.nome} />
                                ))}
                            </datalist>
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
                            <label htmlFor="upload-capaRota" className={style.uploadButton}>
                                {capaRotaFileName ? `Capa: ${capaRotaFileName}` : 'Upload de capa da Rota'}
                            </label>
                            <input 
                                id="upload-capaRota"
                                type="file"  
                                accept="image/*"
                                className={style.hiddenInput}
                                onChange={handlecapaRotaFileChange}
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
                        <th>Cidade</th>
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
                        <td data-label="Cidade">Holambra</td>
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
                     <tr>
                        <td data-label="Id">02</td>
                        <td>
                            <img 
                                src="/Logo_texto.png" 
                                className={style.tableImage} 
                            />
                        </td>
                        <td data-label="Título">Rota das Flores</td>
                        <td data-label="Descrição">Um belo passeio pelos campos floridos da cidade.</td>
                        <td data-label="Cidade">Holambra</td>
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

export default ConsultaRotas;