const express = require('express');
const router = express.Router();
const professeurController = require('../controllers/professeurController');

router.get('/', professeurController.getAllProfessors);
router.get('/:id', professeurController.getProfessorById);
router.post('/', professeurController.createProfessor);
router.put('/:id', professeurController.updateProfessor);
router.delete('/:id', professeurController.deleteProfessor);

module.exports = router;