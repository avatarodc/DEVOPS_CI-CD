import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getSchedules, deleteSchedule } from '../../services/api';

const ScheduleList = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const response = await getSchedules();
        setSchedules(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchSchedules();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Voulez-vous vraiment supprimer cet emploi du temps ?')) {
      try {
        await deleteSchedule(id);
        setSchedules(schedules.filter(schedule => schedule._id !== id));
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
        <h2>Emplois du Temps</h2>
        <Link to="/emploi-du-temps/nouveau" className="btn btn-primary">
          Ajouter un Emploi du Temps
        </Link>
      </div>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Cours</th>
            <th>Professeur</th>
            <th>Classe</th>
            <th>Jour</th>
            <th>Heure de Début</th>
            <th>Heure de Fin</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {schedules.map(schedule => (
            <tr key={schedule._id}>
              <td>{schedule.course?.name || 'N/A'}</td>
              <td>{schedule.professor?.firstName} {schedule.professor?.lastName}</td>
              <td>{schedule.class?.name || 'N/A'}</td>
              <td>{schedule.dayOfWeek}</td>
              <td>{schedule.startTime}</td>
              <td>{schedule.endTime}</td>
              <td>
                <div className="btn-group">
                  <Link 
                    to={`/emploi-du-temps/modifier/${schedule._id}`} 
                    className="btn btn-sm btn-warning"
                  >
                    Modifier
                  </Link>
                  <button 
                    className="btn btn-sm btn-danger" 
                    onClick={() => handleDelete(schedule._id)}
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

export default ScheduleList;