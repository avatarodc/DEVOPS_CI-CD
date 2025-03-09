const Schedule = require('../models/Schedule');
const Course = require('../models/Course');
const Professor = require('../models/Professor');
const Class = require('../models/Class');

exports.getAllSchedules = async (req, res) => {
  try {
    const schedules = await Schedule.find()
      .populate('course', 'name code')
      .populate('professor', 'firstName lastName')
      .populate('class', 'name');
    res.json(schedules);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getScheduleById = async (req, res) => {
  try {
    const schedule = await Schedule.findById(req.params.id)
      .populate('course', 'name code')
      .populate('professor', 'firstName lastName')
      .populate('class', 'name');
    
    if (!schedule) {
      return res.status(404).json({ message: 'Emploi du temps non trouvé' });
    }
    
    res.json(schedule);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createSchedule = async (req, res) => {
  try {
    // Vérifier l'existence du cours
    const courseExists = await Course.findById(req.body.course);
    if (!courseExists) {
      return res.status(400).json({ message: 'Cours invalide' });
    }

    // Vérifier l'existence du professeur
    const professorExists = await Professor.findById(req.body.professor);
    if (!professorExists) {
      return res.status(400).json({ message: 'Professeur invalide' });
    }

    // Vérifier l'existence de la classe
    const classExists = await Class.findById(req.body.class);
    if (!classExists) {
      return res.status(400).json({ message: 'Classe invalide' });
    }

    // Vérifier les conflits d'horaires
    const conflictSchedule = await Schedule.findOne({
      class: req.body.class,
      dayOfWeek: req.body.dayOfWeek,
      $or: [
        {
          startTime: { $lt: req.body.endTime },
          endTime: { $gt: req.body.startTime }
        }
      ]
    });

    if (conflictSchedule) {
      return res.status(400).json({ message: 'Conflit d\'horaire détecté pour cette classe' });
    }

    const schedule = new Schedule(req.body);
    await schedule.save();

    res.status(201).json(schedule);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateSchedule = async (req, res) => {
  try {
    const scheduleId = req.params.id;
    const oldSchedule = await Schedule.findById(scheduleId);

    if (!oldSchedule) {
      return res.status(404).json({ message: 'Emploi du temps non trouvé' });
    }

    // Vérifier l'existence du cours
    if (req.body.course) {
      const courseExists = await Course.findById(req.body.course);
      if (!courseExists) {
        return res.status(400).json({ message: 'Cours invalide' });
      }
    }

    // Vérifier l'existence du professeur
    if (req.body.professor) {
      const professorExists = await Professor.findById(req.body.professor);
      if (!professorExists) {
        return res.status(400).json({ message: 'Professeur invalide' });
      }
    }

    // Vérifier l'existence de la classe
    if (req.body.class) {
      const classExists = await Class.findById(req.body.class);
      if (!classExists) {
        return res.status(400).json({ message: 'Classe invalide' });
      }
    }

    // Vérifier les conflits d'horaires
    const conflictSchedule = await Schedule.findOne({
      _id: { $ne: scheduleId },
      class: req.body.class || oldSchedule.class,
      dayOfWeek: req.body.dayOfWeek || oldSchedule.dayOfWeek,
      $or: [
        {
          startTime: { $lt: req.body.endTime || oldSchedule.endTime },
          endTime: { $gt: req.body.startTime || oldSchedule.startTime }
        }
      ]
    });

    if (conflictSchedule) {
      return res.status(400).json({ message: 'Conflit d\'horaire détecté pour cette classe' });
    }

    const updatedSchedule = await Schedule.findByIdAndUpdate(
      scheduleId, 
      req.body,
      { new: true, runValidators: true }
    );

    res.json(updatedSchedule);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteSchedule = async (req, res) => {
  try {
    const schedule = await Schedule.findByIdAndDelete(req.params.id);
    
    if (!schedule) {
      return res.status(404).json({ message: 'Emploi du temps non trouvé' });
    }

    res.json({ message: 'Emploi du temps supprimé avec succès' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};