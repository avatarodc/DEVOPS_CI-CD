import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  getScheduleById, 
  createSchedule, 
  updateSchedule,
  getCourses,
  getProfessors,
  getClasses
} from '../../services/api';

const ScheduleForm = () => {
  const [formData, setFormData] = useState({
    course: '',
    professor: '',
    class: '',
    dayOfWeek: '',
    startTime: '',
    endTime: ''
  });
  const [courses, setCourses] = useState([]);
  const [professors, setProfessors] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const daysOfWeek = [
    'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [coursesResponse, professorsResponse, classesResponse] = await Promise.all([
          getCourses(),
          getProfessors(),
          getClasses()
        ]);

        setCourses(coursesResponse.data);
        setProfessors(professorsResponse.data);
        setClasses(classesResponse.data);

        if (isEditing) {
          const scheduleResponse = await getScheduleById(id);
          setFormData(scheduleResponse.data);
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
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await updateSchedule(id, formData);
      } else {
        await createSchedule(formData);
      }
      navigate('/emploi-du-temps');
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Erreur : {error}</div>;

  return (
    <div className="container">
      <h2>{isEditing ? 'Modifier un Emploi du Temps' : 'Ajouter un Emploi du Temps'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Cours</label>
          <select
            name="course"
            value={formData.course}
            onChange={handleChange}
            className="form-control"
            required
          >
            <option value="">Sélectionner un cours</option>
            {courses.map(course => (
              <option key={course._id} value={course._id}>
                {course.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Professeur</label>
          <select
            name="professor"
            value={formData.professor}
            onChange={handleChange}
            className="form-control"
            required
          >
            <option value="">Sélectionner un professeur</option>
            {professors.map(professor => (
              <option key={professor._id} value={professor._id}>
                {professor.firstName} {professor.lastName}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Classe</label>
          <select
            name="class"
            value={formData.class}
            onChange={handleChange}
            className="form-control"
            required
          >
            <option value="">Sélectionner une classe</option>
            {classes.map(cls => (
              <option key={cls._id} value={cls._id}>
                {cls.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Jour de la Semaine</label>
          <select
            name="dayOfWeek"
            value={formData.dayOfWeek}
            onChange={handleChange}
            className="form-control"
            required
          >
            <option value="">Sélectionner un jour</option>
            {daysOfWeek.map(day => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Heure de Début</label>
          <input
            type="time"
            name="startTime"
            value={formData.startTime}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>

        <div className="form-group">
          <label>Heure de Fin</label>
          <input
            type="time"
            name="endTime"
            value={formData.endTime}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>

        <button type="submit" className="btn btn-primary">
          {isEditing ? 'Modifier' : 'Ajouter'}
        </button>
      </form>
    </div>
  );
};

export default ScheduleForm;