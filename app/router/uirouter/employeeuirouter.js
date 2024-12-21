const express = require('express');
const employeecontroller = require('../../controller/uicontroller/employeeuicontroller');
const uploadImage = require('../../helper/imagehandler') // Image area 
const router = express.Router();

router.get('/addemployee', employeecontroller.addemployeeGet) // Show Add Form
router.post('/addemployeecreate', uploadImage.single('image'), employeecontroller.addemployeePost) // For add data and handle image 
router.get('/employee', employeecontroller.employeelist) // Show employee list
router.get('/singleemployeeget/:id', employeecontroller.singleemployee) // Show single data
router.post('/updateemployeepost/:id', uploadImage.single('image'), employeecontroller.updateemployee) // Update data
router.get('/deleteemployeeget/:id', employeecontroller.deleteemployee); // Delete data

module.exports = router; 
