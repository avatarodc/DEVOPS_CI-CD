const Course = require('../models/Course');
const Professor = require('../models/Professor');
const Class = require('../models/Class');

exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find()
      .populate('professor', 'firstName lastName')
      .populate('classes', 'name');
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('professor', 'firstName lastName')
      .populate('classes', 'name');
    
    if (!course) {
      return res.status(404).json({ message: 'Cours non trouvé' });
    }
    
    res.json(course);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createCourse = async (req, res) => {
    try {
      // Log détaillé des données reçues
      console.log('Données de cours reçues:', JSON.stringify(req.body, null, 2));
  
      // Validation manuelle des données obligatoires
      const { name, code } = req.body;
      if (!name) {
        return res.status(400).json({ message: 'Le nom du cours est obligatoire' });
      }
      if (!code) {
        return res.status(400).json({ message: 'Le code du cours est obligatoire' });
      }
  
      // Créer un objet de cours avec des valeurs par défaut
      const courseData = {
        name: name,
        code: code,
        description: req.body.description || '',
        professor: req.body.professor || null,
        classes: req.body.classes || []
      };
  
      const course = new Course(courseData);
  
      // Log du cours avant sauvegarde
      console.log('Cours à sauvegarder:', JSON.stringify(course.toObject(), null, 2));
  
      // Validation Mongoose
      try {
        await course.validate();
      } catch (validationError) {
        console.error('Erreurs de validation Mongoose:', validationError);
        return res.status(400).json({ 
          message: 'Erreur de validation', 
          errors: validationError.errors 
        });
      }
  
      // Sauvegarde du cours
      const savedCourse = await course.save();
  
      console.log('Cours sauvegardé avec succès:', savedCourse);
  
      res.status(201).json(savedCourse);
    } catch (err) {
      // Log détaillé de l'erreur
      console.error('Erreur complète lors de la création du cours:', err);
  
      // Gestion des erreurs spécifiques
      if (err.code === 11000) {
        return res.status(400).json({ 
          message: 'Un cours avec ce code existe déjà',
          field: Object.keys(err.keyPattern)[0]
        });
      }
  
      // Erreur générique du serveur
      res.status(500).json({ 
        message: 'Erreur interne du serveur lors de la création du cours', 
        error: err.message,
        stack: process.env.NODE_ENV !== 'production' ? err.stack : undefined
      });
    }
  };

exports.updateCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    const oldCourse = await Course.findById(courseId);

    if (!oldCourse) {
      return res.status(404).json({ message: 'Cours non trouvé' });
    }

    // Vérifier le nouveau professeur
    if (req.body.professor && req.body.professor !== oldCourse.professor) {
      const professorExists = await Professor.findById(req.body.professor);
      if (!professorExists) {
        return res.status(400).json({ message: 'Professeur invalide' });
      }

      // Mettre à jour l'ancien et le nouveau professeur
      await Professor.findByIdAndUpdate(
        oldCourse.professor,
        { $pull: { courses: courseId } }
      );
      await Professor.findByIdAndUpdate(
        req.body.professor,
        { $push: { courses: courseId } }
      );
    }

    // Vérifier et mettre à jour les classes
    if (req.body.classes) {
      // Retirer le cours des anciennes classes
      await Class.updateMany(
        { courses: courseId },
        { $pull: { courses: courseId } }
      );

      // Ajouter le cours aux nouvelles classes
      await Class.updateMany(
        { _id: { $in: req.body.classes } },
        { $push: { courses: courseId } }
      );
    }

    const updatedCourse = await Course.findByIdAndUpdate(
      courseId, 
      req.body,
      { new: true, runValidators: true }
    );

    res.json(updatedCourse);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    
    if (!course) {
      return res.status(404).json({ message: 'Cours non trouvé' });
    }

    // Retirer le cours du professeur
    if (course.professor) {
      await Professor.findByIdAndUpdate(
        course.professor,
        { $pull: { courses: course._id } }
      );
    }

    // Retirer le cours des classes
    await Class.updateMany(
      { courses: course._id },
      { $pull: { courses: course._id } }
    );

    res.json({ message: 'Cours supprimé avec succès' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};