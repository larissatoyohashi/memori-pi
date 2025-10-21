// /front-end/src/services/api.js

import axios from 'axios';

// Instância do Axios configurada para usar o proxy do Next.js (via next.config.js)
const api = axios.create({
  baseURL: '/api' 
});

/**
 * Mapeamento das suas rotas para as funções do service:
 *
 * 1. checkpointRoutes.get("/checkpoints", ...);
 * -> getCheckpoints()
 *
 * 2. checkpointRoutes.post("/checkpoints", ...);
 * -> createCheckpoint(formData)
 *
 * 3. checkpointRoutes.delete("/checkpoints/:id", ...);
 * -> deleteCheckpoint(id)
 *
 * 4. checkpointRoutes.put("/checkpoints/:id", ...); // Corrigi o .put("checkpoints/:id")
 * -> updateCheckpoint(id, formData)
 *
 * 5. checkpointRoutes.get("/checkpoints/:id", ...); // Corrigi o .get("checkpoints/:id")
 * -> getOneCheckpoint(id)
 *
 * 6. (Ainda precisamos das rotas de Rotas, ex: /api/rotas)
 * -> getRotas()
 */


// --- Checkpoints ---

/**
 * Busca todos os checkpoints.
 * Rota: GET /checkpoints
 */
export const getCheckpoints = () => api.get('/checkpoints');

/**
 * Busca um único checkpoint pelo ID.
 * Rota: GET /checkpoints/:id
 */
export const getOneCheckpoint = (id) => api.get(`/checkpoints/${id}`);

/**
 * Cria um novo checkpoint.
 * Rota: POST /checkpoints
 * @param {FormData} formData - Dados do formulário (incluindo imagem).
 */
export const createCheckpoint = (formData) => {
  return api.post('/checkpoints', formData, {
    headers: {
      'Content-Type': 'multipart/form-data' // Garante o header para upload
    }
  });
};

/**
 * Atualiza um checkpoint existente.
 * Rota: PUT /checkpoints/:id
 * @param {string|number} id - O ID do checkpoint a ser atualizado.
 * @param {FormData} formData - Os novos dados (incluindo, opcionalmente, uma nova imagem).
 */
export const updateCheckpoint = (id, formData) => {
  return api.put(`/checkpoints/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data' // Necessário se a imagem puder ser atualizada
    }
  });
};

/**
 * Exclui um checkpoint.
 * Rota: DELETE /checkpoints/:id
 * @param {string|number} id - O ID do checkpoint a ser excluído.
 */
export const deleteCheckpoint = (id) => api.delete(`/checkpoints/${id}`);


// --- Rotas ---
// (Presumindo que você tenha rotas para buscar os nomes das rotas)

/**
 * Busca todas as rotas disponíveis (para o dropdown).
 * Rota: GET /rotas (Exemplo)
 */
export const getRotas = () => api.get('/rotas'); // ATENÇÃO: Confirme este endpoint com seu time de back-end.


export default api;