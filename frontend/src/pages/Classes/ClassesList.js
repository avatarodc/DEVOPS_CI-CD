import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getClasses, deleteClass } from '../../services/api';

const ClassesList = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await getClasses();
        setClasses(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchClasses();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Voulez-vous vraiment supprimer cette classe ?')) {
      try {
        await deleteClass(id);
        setClasses(classes.filter(cls => cls._id !== id));
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
        <h2>Liste des Classes</h2>
        <Link to="/classes/nouveau" className="btn btn-primary">
          Ajouter une Classe
        </Link>
      </div>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Nom</th>
            <th>Année</th>
            <th>Capacité</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {classes.map(cls => (
            <tr key={cls._id}>
              <td>{cls.name}</td>
              <td>{cls.year}</td>
              <td>{cls.capacity}</td>
              <td>
                <div className="btn-group">
                  <Link 
                    to={`/classes/modifier/${cls._id}`} 
                    className="btn btn-sm btn-warning"
                  >
                    Modifier
                  </Link>
                  <button 
                    className="btn btn-sm btn-danger" 
                    onClick={() => handleDelete(cls._id)}
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

export default ClassesList;