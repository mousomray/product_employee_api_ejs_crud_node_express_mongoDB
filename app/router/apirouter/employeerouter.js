const express = require('express')
const employeecontroller = require('../../controller/apicontroller/employeecontroller')
const uploadImage = require('../../helper/imagehandler') // Image handle Area
const router = express.Router()

router.post('/createemployee', uploadImage.single('image'), employeecontroller.create) //  POST with handle image 
router.get('/employeelist', employeecontroller.getall) //  GET
router.get('/singleemployee/:id', employeecontroller.getsingle) // GET single
router.put('/editemployee/:id', uploadImage.single('image'), employeecontroller.employeeupdate) // PUT or PATCH  and handle image
router.delete('/deleteemployee/:id', employeecontroller.employeedelete) // DELETE

module.exports = router 