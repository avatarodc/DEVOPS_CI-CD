import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  getClassById, 
  createClass, 
  updateClass,
  getCourses
} from '../../services/api';

const ClassesForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    year: '',
    capacity: '',
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
          const classResponse = await getClassById(id);
          setFormData(classResponse.data);
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
        await updateClass(id, formData);
      } else {
        await createClass(formData);
      }
      navigate('/classes');
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Erreur : {error}</div>;

  return (
    <div className="container">
      <h2>{isEditing ? 'Modifier une Classe' : 'Ajouter une Classe'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nom de la Classe</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        <div className="form-group">
          <label>Année</label>
          <input
            type="text"
            name="year"
            value={formData.year}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        <div className="form-group">
          <label>Capacité</label>
          <input
            type="number"
            name="capacity"
            value={formData.capacity}
            onChange={handleChange}
            className="form-control"
            required
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

export default ClassesForm;