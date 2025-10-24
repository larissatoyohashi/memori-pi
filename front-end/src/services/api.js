import axios from 'axios';

// Instância do Axios
const api = axios.create({ baseURL: '/api' });

// Checkpoints 
export const getCheckpoints = () => api.get('/checkpoint');
export const getOneCheckpoint = (id) => api.get(`/checkpoint/${id}`);
export const createCheckpoint = (formData) => api.post('/checkpoint', formData);
export const updateCheckpoint = (id, formData) => api.put(`/checkpoint/${id}`, formData);
export const deleteCheckpoint = (id) => api.delete(`/checkpoint/${id}`);

// Rotas
export const getRotas = () => api.get('/rota'); 
export const getOneRota = (id) => api.get(`/rota/${id}`);
export const createRota = (formData) => api.post('/rota', formData);
export const updateRota = (id, formData) => api.put(`/rota/${id}`, formData);
export const deleteRota = (id) => api.delete(`/rota/${id}`);

// Quizzes
export const getQuizzes = () => api.get('/quiz');
export const getOneQuiz = (id) => api.get(`/quiz/${id}`);
export const createQuiz = (quizData) => {return api.post('/quiz', quizData);};
export const updateQuiz = (id, quizData) => {return api.put(`/quiz/${id}`, quizData);};
export const deleteQuiz = (id) => api.delete(`/quiz/${id}`);

// Usuarios
export const getUsuarios = () => api.get('/usuario');
export const getOneUsuario = (id) => api.get(`/usuario/${id}`)
export const createUsuario = (usuarioData) => {return api.post('/usuario', usuarioData);};
export const updateUsuario = (id, usuarioData) => {return api.put(`/usuario/${id}`, usuarioData);};
export const deleteUsuario = (id) => api.delete(`/usuario/${id}`);

// Modelagens
export const getModelagens = () => api.get('/modelagem');
export const getOneModelagem = (id) => api.get(`/modelagem/${id}`);
export const createModelagem = (formData) => {return api.post('/modelagem', formData);};
export const updateModelagem = (id, formData) => {return api.put(`/modelagem/${id}`, formData);};
export const deleteModelagem = (id) => api.delete(`/modelagem/${id}`);

export default api;