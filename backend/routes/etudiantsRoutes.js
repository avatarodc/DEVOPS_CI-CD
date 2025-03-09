const express = require('express');
const router = express.Router();
const etudiantsController = require('../controllers/etudiantsController');

router.get('/', etudiantsController.getAllStudents);
router.get('/:id', etudiantsController.getStudentById);
router.post('/', etudiantsController.createStudent);
router.put('/:id', etudiantsController.updateStudent);
router.delete('/:id', etudiantsController.deleteStudent);

module.exports = router;