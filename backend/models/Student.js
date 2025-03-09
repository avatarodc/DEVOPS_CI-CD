const mongoose = require('mongoose');

// Vérifier si le modèle existe déjà
if (mongoose.models.Student) {
  module.exports = mongoose.model('Student');
} else {
  const StudentSchema = new mongoose.Schema({
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Class'
    },
    enrollmentDate: {
      type: Date,
      default: Date.now
    }
  }, {
    timestamps: true
  });

  module.exports = mongoose.model('Student', StudentSchema);
}