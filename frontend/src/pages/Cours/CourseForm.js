import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createCourse, getCourseById, updateCourse } from '../../services/api';
import { getProfessors, getClasses } from '../../services/api';

const CourseForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    professor: '',
    classes: []
  });

  const [professors, setProfessors] = useState([]);
  const [classList, setClassList] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [professorsResponse, classesResponse] = await Promise.all([
          getProfessors(),
          getClasses()
        ]);

        setProfessors(professorsResponse.data);
        setClassList(classesResponse.data);

        if (isEditing) {
          const courseResponse = await getCourseById(id);
          setFormData(courseResponse.data);
        }
      } catch (err) {
        console.error('Erreur de chargement des données:', err);
        setError(err.response?.data?.message || 'Erreur de chargement des données');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id, isEditing]);

  const handleChange = (e) => {
    const { name, value, type, selectedOptions } = e.target;
    
    if (type === 'select-multiple') {
      const selectedClasses = Array.from(selectedOptions).map(option => option.value);
      setFormData(prevData => ({ ...prevData, [name]: selectedClasses }));
    } else {
      setFormData(prevData => ({ ...prevData, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      console.log('Données de cours envoyées:', formData);

      if (isEditing) {
        await updateCourse(id, formData);
      } else {
        await createCourse(formData);
      }
      navigate('/cours');
    } catch (err) {
      console.error('Erreur détaillée:', err);
      
      if (err.response) {
        const errorMessage = err.response.data.message || 
                             (err.response.data.errors && 
                              Object.values(err.response.data.errors).join(', ')) || 
                             'Erreur lors de la création du cours';
        setError(errorMessage);
      } else if (err.request) {
        setError('Pas de réponse du serveur');
      } else {
        setError('Erreur de configuration de la requête');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="container">
      <h2>{isEditing ? 'Modifier un Cours' : 'Ajouter un Cours'}</h2>
      
      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nom du Cours</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="form-control"
            required
            placeholder="Entrez le nom du cours"
          />
        </div>

        <div className="form-group">
          <label>Code du Cours</label>
          <input
            type="text"
            name="code"
            value={formData.code}
            onChange={handleChange}
            className="form-control"
            required
            placeholder="Entrez le code du cours"
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="form-control"
            placeholder="Description du cours (optionnel)"
            rows="3"
          />
        </div>

        <div className="form-group">
          <label>Professeur</label>
          <select
            name="professor"
            value={formData.professor}
            onChange={handleChange}
            className="form-control"
          >
            <option value="">Sélectionner un professeur</option>
            {professors.map(prof => (
              <option key={prof._id} value={prof._id}>
                {prof.firstName} {prof.lastName}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Classes</label>
          <select
            multiple
            name="classes"
            value={formData.classes}
            onChange={handleChange}
            className="form-control"
            size="5"
          >
            {classList.map(cls => (
              <option key={cls._id} value={cls._id}>
                {cls.name} - {cls.year}
              </option>
            ))}
          </select>
          <small className="form-text text-muted">
            Maintenez Ctrl (ou Cmd sur Mac) pour sélectionner plusieurs classes
          </small>
        </div>

        <button 
          type="submit" 
          className="btn btn-primary mt-3" 
          disabled={isLoading}
        >
          {isLoading ? 'Envoi en cours...' : (isEditing ? 'Modifier' : 'Ajouter')}
        </button>
      </form>
    </div>
  );
};

export default CourseForm;