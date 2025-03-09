import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="jumbotron">
      <h1 className="display-4">Bienvenue sur l'application de Gestion d'Établissement</h1>
      <p className="lead">
        Cette application vous permet de gérer les classes, cours, étudiants, professeurs et emplois du temps.
      </p>
      <hr className="my-4" />
      <p>Sélectionnez un module pour commencer :</p>
      
      <div className="row mt-4">
        <div className="col-md-4 mb-3">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Gestion des Classes</h5>
              <p className="card-text">Gérez les classes de l'établissement.</p>
              <Link to="/classes" className="btn btn-primary">Accéder</Link>
            </div>
          </div>
        </div>
        
        <div className="col-md-4 mb-3">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Gestion des Étudiants</h5>
              <p className="card-text">Gérez les informations des étudiants.</p>
              <Link to="/etudiants" className="btn btn-primary">Accéder</Link>
            </div>
          </div>
        </div>
        
        <div className="col-md-4 mb-3">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Gestion des Cours</h5>
              <p className="card-text">Gérez les cours dispensés.</p>
              <Link to="/cours" className="btn btn-primary">Accéder</Link>
            </div>
          </div>
        </div>
      </div>
      
      <div className="row">
        <div className="col-md-6 mb-3">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Gestion des Professeurs</h5>
              <p className="card-text">Gérez les informations des professeurs.</p>
              <Link to="/professeurs" className="btn btn-primary">Accéder</Link>
            </div>
          </div>
        </div>
        
        <div className="col-md-6 mb-3">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Gestion des Emplois du Temps</h5>
              <p className="card-text">Gérez les emplois du temps.</p>
              <Link to="/emploidutemps" className="btn btn-primary">Accéder</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;