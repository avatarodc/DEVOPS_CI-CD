const Class = require('../models/Class');
const Student = require('../models/Student');
const Course = require('../models/Course');

// Dans classController.js ou autres contrôleurs qui utilisent populate
exports.getAllClasses = async (req, res) => {
    try {
      const classes = await Class.find()
        .populate({
          path: 'students',
          model: 'Student', // Spécifiez explicitement le modèle
          select: 'firstName lastName email' // Sélectionnez les champs spécifiques
        })
        .populate({
          path: 'courses',
          select: 'name code'
        });
      
      res.json(classes);
    } catch (err) {
      console.error('Erreur lors de la récupération des classes:', err);
      res.status(500).json({ 
        message: 'Erreur lors de la récupération des classes', 
        error: err.message 
      });
    }
  };


  // Méthode pour ajouter un étudiant à une classe
exports.addStudentToClass = async (req, res) => {
    try {
      const { classId, studentId } = req.body;
      
      // Vérifier si la classe existe
      const classe = await Class.findById(classId);
      if (!classe) {
        return res.status(404).json({ message: 'Classe non trouvée' });
      }
  
      // Vérifier si l'étudiant existe
      const student = await Student.findById(studentId);
      if (!student) {
        return res.status(404).json({ message: 'Étudiant non trouvé' });
      }
  
      // Vérifier si l'étudiant est déjà dans la classe
      if (!classe.students.includes(studentId)) {
        classe.students.push(studentId);
        await classe.save();
  
        // Mettre à jour la référence de classe pour l'étudiant
        student.classId = classId;
        await student.save();
      }
  
      res.status(200).json(classe);
    } catch (err) {
      console.error('Erreur lors de l\'ajout d\'un étudiant à la classe:', err);
      res.status(500).json({ 
        message: 'Erreur lors de l\'ajout de l\'étudiant', 
        error: err.message 
      });
    }
  };


exports.getClassById = async (req, res) => {
  try {
    const classe = await Class.findById(req.params.id)
      .populate('students', 'firstName lastName')
      .populate('courses', 'name code');
    
    if (!classe) {
      return res.status(404).json({ message: 'Classe non trouvée' });
    }
    
    res.json(classe);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createClass = async (req, res) => {
  try {
    const classe = new Class(req.body);

    // Gérer les étudiants
    if (req.body.students && req.body.students.length > 0) {
      const studentsExist = await Student.find({ 
        _id: { $in: req.body.students } 
      });
      
      if (studentsExist.length !== req.body.students.length) {
        return res.status(400).json({ message: 'Un ou plusieurs étudiants sont invalides' });
      }

      // Mettre à jour les étudiants avec la nouvelle classe
      await Student.updateMany(
        { _id: { $in: req.body.students } },
        { classId: classe._id }
      );
    }

    // Gérer les cours
    if (req.body.courses && req.body.courses.length > 0) {
      const coursesExist = await Course.find({ 
        _id: { $in: req.body.courses } 
      });
      
      if (coursesExist.length !== req.body.courses.length) {
        return res.status(400).json({ message: 'Un ou plusieurs cours sont invalides' });
      }
    }

    await classe.save();
    res.status(201).json(classe);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateClass = async (req, res) => {
    try {
      const classId = req.params.id;
      const oldClass = await Class.findById(classId);
  
      if (!oldClass) {
        return res.status(404).json({ message: 'Classe non trouvée' });
      }
  
      // Gérer la mise à jour des étudiants
      if (req.body.students) {
        // Retirer l'ancienne classe des étudiants précédents
        await Student.updateMany(
          { classId: classId },
          { $unset: { classId: 1 } }
        );
  
        // Ajouter la nouvelle classe aux nouveaux étudiants
        await Student.updateMany(
          { _id: { $in: req.body.students } },
          { classId: classId }
        );
      }
  
      // Gérer la mise à jour des cours
      if (req.body.courses) {
        // Vérifier que tous les cours sont valides
        const coursesExist = await Course.find({ 
          _id: { $in: req.body.courses } 
        });
        
        if (coursesExist.length !== req.body.courses.length) {
          return res.status(400).json({ message: 'Un ou plusieurs cours sont invalides' });
        }
      }
  
      const updatedClass = await Class.findByIdAndUpdate(
        classId, 
        req.body,
        { new: true, runValidators: true }
      );
  
      res.json(updatedClass);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };
  
  exports.deleteClass = async (req, res) => {
    try {
      const classe = await Class.findByIdAndDelete(req.params.id);
      
      if (!classe) {
        return res.status(404).json({ message: 'Classe non trouvée' });
      }
  
      // Retirer la classe des étudiants
      await Student.updateMany(
        { classId: classe._id },
        { $unset: { classId: 1 } }
      );
  
      // Retirer la classe des cours
      await Course.updateMany(
        { classes: classe._id },
        { $pull: { classes: classe._id } }
      );
  
      res.json({ message: 'Classe supprimée avec succès' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };