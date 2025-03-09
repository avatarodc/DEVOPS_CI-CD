const express = require('express');
const router = express.Router();
const coursController = require('../controllers/coursController');

router.get('/', coursController.getAllCourses);
router.get('/:id', coursController.getCourseById);
router.post('/', coursController.createCourse);
router.put('/:id', coursController.updateCourse);
router.delete('/:id', coursController.deleteCourse);

module.exports = router;