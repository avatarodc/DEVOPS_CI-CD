import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  getProfessorById, 
  createProfessor, 
  updateProfessor,
  getCourses
} from '../../services/api';

const ProfessorForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    specialization: '',
    courses: []
  });
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const coursesResponse = await getCourses();
        setCourses(coursesResponse.data);

        if (isEditing) {
          const professorResponse = await getProfessorById(id);
          setFormData(professorResponse.data);
        }
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, [id, isEditing]);

  const handleChange = (e) => {
    const { name, value, type, selectedOptions } = e.target;
    
    if (type === 'select-multiple') {
      const selectedCourses = Array.from(selectedOptions).map(option => option.value);
      setFormData({ ...formData, [name]: selectedCourses });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await updateProfessor(id, formData);
      } else {
        await createProfessor(formData);
      }
      navigate('/professeurs');
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Erreur : {error}</div>;

  return (
    <div className="container">
      <h2>{isEditing ? 'Modifier un Professeur' : 'Ajouter un Professeur'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Prénom</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        <div className="form-group">
          <label>Nom</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        <div className="form-group">
          <label>Spécialisation</label>
          <input
            type="text"
            name="specialization"
            value={formData.specialization}
            onChange={handleChange}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Cours</label>
          <select
            multiple
            name="courses"
            value={formData.courses}
            onChange={handleChange}
            className="form-control"
          >
            {courses.map(course => (
              <option key={course._id} value={course._id}>
                {course.name}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="btn btn-primary">
          {isEditing ? 'Modifier' : 'Ajouter'}
        </button>
      </form>
    </div>
  );
};

export default ProfessorForm;