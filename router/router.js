const express = require('express');
var studentController = require('../controller/studentController');
var router = express.Router();

router.get('/getStudent', studentController.getStudent);
router.post('/addStudent', studentController.addStudent);
router.put('/updateStudent/:id', studentController.updateStudent);
router.delete('/deleteStudent/:id', studentController.deleteStudent);

module.exports = router;