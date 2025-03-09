import axios from 'axios';

const isRenderHosting = window.location.hostname.includes('render.com');

// Choisir l'URL de base en fonction de l'hôte
const baseURL = isRenderHosting || window.location.hostname !== 'localhost' 
  ? '/api'  // Sur Render ou tout autre hôte non-local
  : 'http://localhost:5000/api';  // Uniquement en local

console.log('API baseURL:', baseURL); 

// Créer une instance axios préconfigurée
const api = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Méthodes pour les Étudiants
export const getStudents = () => api.get('/etudiants');
export const getStudentById = (id) => api.get(`/etudiants/${id}`);
export const createStudent = (studentData) => api.post('/etudiants', studentData);
export const updateStudent = (id, studentData) => api.put(`/etudiants/${id}`, studentData);
export const deleteStudent = (id) => api.delete(`/etudiants/${id}`);

// Méthodes pour les Cours
export const getCourses = () => api.get('/cours');
export const getCourseById = (id) => api.get(`/cours/${id}`);
export const createCourse = (courseData) => api.post('/cours', courseData);
export const updateCourse = (id, courseData) => api.put(`/cours/${id}`, courseData);
export const deleteCourse = (id) => api.delete(`/cours/${id}`);

// Méthodes pour les Professeurs
export const getProfessors = () => api.get('/professeurs');
export const getProfessorById = (id) => api.get(`/professeurs/${id}`);
export const createProfessor = (professorData) => api.post('/professeurs', professorData);
export const updateProfessor = (id, professorData) => api.put(`/professeurs/${id}`, professorData);
export const deleteProfessor = (id) => api.delete(`/professeurs/${id}`);

// Méthodes pour les Classes
export const getClasses = () => api.get('/classes');
export const getClassById = (id) => api.get(`/classes/${id}`);
export const createClass = (classData) => api.post('/classes', classData);
export const updateClass = (id, classData) => api.put(`/classes/${id}`, classData);
export const deleteClass = (id) => api.delete(`/classes/${id}`);

// Méthodes pour l'Emploi du Temps
export const getSchedules = () => api.get('/schedules');
export const getScheduleById = (id) => api.get(`/schedules/${id}`);
export const createSchedule = (scheduleData) => api.post('/schedules', scheduleData);
export const updateSchedule = (id, scheduleData) => api.put(`/schedules/${id}`, scheduleData);
export const deleteSchedule = (id) => api.delete(`/schedules/${id}`);

export default api;