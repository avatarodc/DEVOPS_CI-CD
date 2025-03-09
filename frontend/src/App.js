import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ErrorBoundary from './components/ErrorBoundary';

// Pages existantes
import StudentsList from './pages/Etudiants/StudentsList';
import StudentForm from './pages/Etudiants/StudentForm';
import CoursesList from './pages/Cours/CoursesList';
import CourseForm from './pages/Cours/CourseForm';
import ProfessorsList from './pages/Professeurs/ProfessorsList';
import ProfessorForm from './pages/Professeurs/ProfessorForm';
import ClassesList from './pages/Classes/ClassesList';
import ClassesForm from './pages/Classes/ClassesForm';
import ScheduleList from './pages/EmploiDuTemps/ScheduleList';
import ScheduleForm from './pages/EmploiDuTemps/ScheduleForm';

import Home from './pages/Home';

import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <Router>
      <ErrorBoundary>
        <div className="App">
          <Navbar />
          <Routes>
            {/* Routes Accueil */}
            <Route 
              path="/" 
              element={
                <ErrorBoundary>
                  <Home />
                </ErrorBoundary>
              } 
            />
            
            {/* Routes Étudiants */}
            <Route 
              path="/etudiants" 
              element={
                <ErrorBoundary>
                  <StudentsList />
                </ErrorBoundary>
              } 
            />
            <Route 
              path="/etudiants/nouveau" 
              element={
                <ErrorBoundary>
                  <StudentForm />
                </ErrorBoundary>
              } 
            />
            <Route 
              path="/etudiants/modifier/:id" 
              element={
                <ErrorBoundary>
                  <StudentForm />
                </ErrorBoundary>
              } 
            />

            {/* Routes Cours */}
            <Route 
              path="/cours" 
              element={
                <ErrorBoundary>
                  <CoursesList />
                </ErrorBoundary>
              } 
            />
            <Route 
              path="/cours/nouveau" 
              element={
                <ErrorBoundary>
                  <CourseForm />
                </ErrorBoundary>
              } 
            />
            <Route 
              path="/cours/modifier/:id" 
              element={
                <ErrorBoundary>
                  <CourseForm />
                </ErrorBoundary>
              } 
            />

            {/* Routes Professeurs */}
            <Route 
              path="/professeurs" 
              element={
                <ErrorBoundary>
                  <ProfessorsList />
                </ErrorBoundary>
              } 
            />
            <Route 
              path="/professeurs/nouveau" 
              element={
                <ErrorBoundary>
                  <ProfessorForm />
                </ErrorBoundary>
              } 
            />
            <Route 
              path="/professeurs/modifier/:id" 
              element={
                <ErrorBoundary>
                  <ProfessorForm />
                </ErrorBoundary>
              } 
            />

            {/* Routes Classes */}
            <Route 
              path="/classes" 
              element={
                <ErrorBoundary>
                  <ClassesList />
                </ErrorBoundary>
              } 
            />
            <Route 
              path="/classes/nouveau" 
              element={
                <ErrorBoundary>
                  <ClassesForm />
                </ErrorBoundary>
              } 
            />
            <Route 
              path="/classes/modifier/:id" 
              element={
                <ErrorBoundary>
                  <ClassesForm />
                </ErrorBoundary>
              } 
            />

            {/* Routes Emploi du Temps */}
            <Route 
              path="/emploi-du-temps" 
              element={
                <ErrorBoundary>
                  <ScheduleList />
                </ErrorBoundary>
              } 
            />
            <Route 
              path="/emploi-du-temps/nouveau" 
              element={
                <ErrorBoundary>
                  <ScheduleForm />
                </ErrorBoundary>
              } 
            />
            <Route 
              path="/emploi-du-temps/modifier/:id" 
              element={
                <ErrorBoundary>
                  <ScheduleForm />
                </ErrorBoundary>
              } 
            />
          </Routes>
        </div>
      </ErrorBoundary>
    </Router>
  );
}

export default App;