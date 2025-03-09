const Student = require('../models/Student');
const Class = require('../models/Class');

exports.getAllStudents = async (req, res) => {
  try {
    const students = await Student.find().populate('classId');
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).populate('classId');
    if (!student) {
      return res.status(404).json({ message: 'Étudiant non trouvé' });
    }
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createStudent = async (req, res) => {
  try {
    const student = new Student(req.body);
    
    // Vérifier si la classe existe
    if (req.body.classId) {
      const classExists = await Class.findById(req.body.classId);
      if (!classExists) {
        return res.status(400).json({ message: 'Classe invalide' });
      }
    }

    await student.save();
    
    // Mise à jour de la classe si spécifiée
    if (req.body.classId) {
      await Class.findByIdAndUpdate(
        req.body.classId,
        { $push: { students: student._id } },
        { new: true }
      );
    }

    res.status(201).json(student);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateStudent = async (req, res) => {
  try {
    const studentId = req.params.id;
    const oldStudent = await Student.findById(studentId);

    if (!oldStudent) {
      return res.status(404).json({ message: 'Étudiant non trouvé' });
    }

    // Vérifier si la nouvelle classe existe
    if (req.body.classId && req.body.classId !== oldStudent.classId) {
      const classExists = await Class.findById(req.body.classId);
      if (!classExists) {
        return res.status(400).json({ message: 'Classe invalide' });
      }

      // Retirer l'étudiant de l'ancienne classe
      if (oldStudent.classId) {
        await Class.findByIdAndUpdate(
          oldStudent.classId,
          { $pull: { students: studentId } }
        );
      }

      // Ajouter l'étudiant à la nouvelle classe
      await Class.findByIdAndUpdate(
        req.body.classId,
        { $push: { students: studentId } },
        { new: true }
      );
    }

    const updatedStudent = await Student.findByIdAndUpdate(
      studentId, 
      req.body,
      { new: true, runValidators: true }
    );

    res.json(updatedStudent);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    
    if (!student) {
      return res.status(404).json({ message: 'Étudiant non trouvé' });
    }

    // Retirer l'étudiant de sa classe
    if (student.classId) {
      await Class.findByIdAndUpdate(
        student.classId,
        { $pull: { students: student._id } }
      );
    }

    res.json({ message: 'Étudiant supprimé avec succès' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};