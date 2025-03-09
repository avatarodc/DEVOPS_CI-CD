const Professor = require('../models/Professor');
const Course = require('../models/Course');

exports.getAllProfessors = async (req, res) => {
  try {
    const professors = await Professor.find().populate('courses', 'name code');
    res.json(professors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getProfessorById = async (req, res) => {
  try {
    const professor = await Professor.findById(req.params.id)
      .populate('courses', 'name code');
    
    if (!professor) {
      return res.status(404).json({ message: 'Professeur non trouvé' });
    }
    
    res.json(professor);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createProfessor = async (req, res) => {
  try {
    const professor = new Professor(req.body);

    // Gérer les cours associés
    if (req.body.courses && req.body.courses.length > 0) {
      const coursesExist = await Course.find({ 
        _id: { $in: req.body.courses } 
      });
      
      if (coursesExist.length !== req.body.courses.length) {
        return res.status(400).json({ message: 'Un ou plusieurs cours sont invalides' });
      }

      // Mettre à jour les cours avec le nouveau professeur
      await Course.updateMany(
        { _id: { $in: req.body.courses } },
        { professor: professor._id }
      );
    }

    await professor.save();
    res.status(201).json(professor);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateProfessor = async (req, res) => {
  try {
    const professorId = req.params.id;
    const oldProfessor = await Professor.findById(professorId);

    if (!oldProfessor) {
      return res.status(404).json({ message: 'Professeur non trouvé' });
    }

    // Gérer la mise à jour des cours
    if (req.body.courses) {
      // Retirer le professeur des anciens cours
      await Course.updateMany(
        { professor: professorId },
        { $unset: { professor: 1 } }
      );

      // Ajouter le professeur aux nouveaux cours
      await Course.updateMany(
        { _id: { $in: req.body.courses } },
        { professor: professorId }
      );
    }

    const updatedProfessor = await Professor.findByIdAndUpdate(
      professorId, 
      req.body,
      { new: true, runValidators: true }
    );

    res.json(updatedProfessor);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteProfessor = async (req, res) => {
  try {
    const professor = await Professor.findByIdAndDelete(req.params.id);
    
    if (!professor) {
      return res.status(404).json({ message: 'Professeur non trouvé' });
    }

    // Retirer le professeur de tous ses cours
    await Course.updateMany(
      { professor: professor._id },
      { $unset: { professor: 1 } }
    );

    res.json({ message: 'Professeur supprimé avec succès' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};