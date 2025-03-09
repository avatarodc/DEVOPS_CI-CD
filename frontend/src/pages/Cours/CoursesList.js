import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCourses, deleteCourse } from '../../services/api';

const CoursesList = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await getCourses();
        setCourses(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Voulez-vous vraiment supprimer ce cours ?')) {
      try {
        await deleteCourse(id);
        setCourses(courses.filter(course => course._id !== id));
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
        <h2>Liste des Cours</h2>
        <Link to="/cours/nouveau" className="btn btn-primary">
          Ajouter un Cours
        </Link>
      </div>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Nom</th>
            <th>Code</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {courses.map(course => (
            <tr key={course._id}>
              <td>{course.name}</td>
              <td>{course.code}</td>
              <td>{course.description}</td>
              <td>
                <div className="btn-group">
                  <Link 
                    to={`/cours/modifier/${course._id}`} 
                    className="btn btn-sm btn-warning"
                  >
                    Modifier
                  </Link>
                  <button 
                    className="btn btn-sm btn-danger" 
                    onClick={() => handleDelete(course._id)}
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

export default CoursesList;