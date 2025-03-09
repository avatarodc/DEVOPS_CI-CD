import React, { useState, useEffect } from 'react';
import api from '../../services/api'; // Importer le service API

const StudentsList = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // État pour le formulaire
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: ''
  });
  
  useEffect(() => {
    // Fonction pour récupérer les étudiants
    const fetchStudents = async () => {
      try {
        // Utiliser l'instance api au lieu d'axios avec URL complète
        const res = await api.get('/etudiants');
        setStudents(res.data);
        setLoading(false);
      } catch (err) {
        setError('Erreur lors de la récupération des données');
        setLoading(false);
        console.error(err);
      }
    };
    
    fetchStudents();
  }, []);
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Utiliser l'instance api au lieu d'axios avec URL complète
      const res = await api.post('/etudiants', formData);
      setStudents([...students, res.data]);
      // Réinitialiser le formulaire
      setFormData({
        firstName: '',
        lastName: '',
        email: ''
      });
    } catch (err) {
      console.error(err);
      setError('Erreur lors de l\'ajout de l\'étudiant');
    }
  };
  
  // Le reste du composant reste inchangé
  if (loading) return <div className="text-center mt-5"><div className="spinner-border" role="status"></div></div>;
  
  return (
    <div>
      <h2 className="mb-4">Gestion des Étudiants</h2>
      
      {error && <div className="alert alert-danger">{error}</div>}
      
      {/* Formulaire d'ajout */}
      <div className="card mb-4">
        <div className="card-header">
          Ajouter un étudiant
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="firstName" className="form-label">Prénom</label>
              <input
                type="text"
                className="form-control"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="lastName" className="form-label">Nom</label>
              <input
                type="text"
                className="form-control"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">Ajouter</button>
          </form>
        </div>
      </div>
      
      {/* Liste des étudiants */}
      <div className="card">
        <div className="card-header">
          Liste des étudiants
        </div>
        <div className="card-body">
          {students.length === 0 ? (
            <p className="text-center">Aucun étudiant enregistré</p>
          ) : (
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Prénom</th>
                  <th>Nom</th>
                  <th>Email</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map(student => (
                  <tr key={student._id}>
                    <td>{student.firstName}</td>
                    <td>{student.lastName}</td>
                    <td>{student.email}</td>
                    <td>
                      <button className="btn btn-sm btn-info me-2">Modifier</button>
                      <button className="btn btn-sm btn-danger">Supprimer</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentsList;