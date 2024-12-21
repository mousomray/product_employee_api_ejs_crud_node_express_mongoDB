const express = require('express')
const productcontroller = require('../../controller/apicontroller/productcontroller')
const uploadImage = require('../../helper/imagehandler') // Image handle Area
const router = express.Router()

router.post('/createproduct', uploadImage.single('image'), productcontroller.create) // POST
router.get('/productlist', productcontroller.getall) // GET
router.get('/singleproduct/:id', productcontroller.getsingle) // GET single
router.put('/editproduct/:id', uploadImage.single('image'), productcontroller.productupdate) // PUT or PATCH
router.delete('/delete/:id', productcontroller.productdelete) // DELETE 
router.get('/productlist/search', productcontroller.search) // Search Product with Brand
router.get('/products/brands', productcontroller.getBrands); // Brand List
router.get('/products/brand/:brand', productcontroller.branddetails); // Brand Details

module.exports = router