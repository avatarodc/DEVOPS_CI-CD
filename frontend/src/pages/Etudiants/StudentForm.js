import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createStudent, getStudentById, updateStudent } from '../../services/api';

const StudentForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    classId: ''
  });

  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  useEffect(() => {
    if (isEditing) {
      const fetchStudent = async () => {
        try {
          const response = await getStudentById(id);
          setFormData(response.data);
        } catch (error) {
          console.error('Erreur de récupération de l\'étudiant', error);
        }
      };
      fetchStudent();
    }
  }, [id, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await updateStudent(id, formData);
      } else {
        await createStudent(formData);
      }
      navigate('/etudiants');
    } catch (error) {
      console.error('Erreur de soumission du formulaire', error);
    }
  };

  return (
    <div className="container">
      <h2>{isEditing ? 'Modifier un Étudiant' : 'Ajouter un Étudiant'}</h2>
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
          <label>Classe</label>
          <input
            type="text"
            name="classId"
            value={formData.classId}
            onChange={handleChange}
            className="form-control"
          />
        </div>
        <button type="submit" className="btn btn-primary">
          {isEditing ? 'Modifier' : 'Ajouter'}
        </button>
      </form>
    </div>
  );
};

export default StudentForm;