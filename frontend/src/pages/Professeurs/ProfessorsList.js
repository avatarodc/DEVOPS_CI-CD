import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProfessors, deleteProfessor } from '../../services/api';

const ProfessorsList = () => {
  const [professors, setProfessors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfessors = async () => {
      try {
        const response = await getProfessors();
        setProfessors(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProfessors();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Voulez-vous vraiment supprimer ce professeur ?')) {
      try {
        await deleteProfessor(id);
        setProfessors(professors.filter(professor => professor._id !== id));
      } catch (err) {
        setError(err.message);
      }
    }
  };

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Erreur : {error}</div>;

  return (
    <div className="container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Liste des Professeurs</h2>
        <Link to="/professeurs/nouveau" className="btn btn-primary">
          Ajouter un Professeur
        </Link>
      </div>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Prénom</th>
            <th>Nom</th>
            <th>Email</th>
            <th>Spécialisation</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {professors.map(professor => (
            <tr key={professor._id}>
              <td>{professor.firstName}</td>
              <td>{professor.lastName}</td>
              <td>{professor.email}</td>
              <td>{professor.specialization}</td>
              <td>
                <div className="btn-group">
                  <Link 
                    to={`/professeurs/modifier/${professor._id}`} 
                    className="btn btn-sm btn-warning"
                  >
                    Modifier
                  </Link>
                  <button 
                    className="btn btn-sm btn-danger" 
                    onClick={() => handleDelete(professor._id)}
                  >
                    Supprimer
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProfessorsList;