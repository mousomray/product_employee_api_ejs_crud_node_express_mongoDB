const express = require('express');
const productcontroller = require('../../controller/uicontroller/productuicontroller');
const uploadImage = require('../../helper/imagehandler') // Image area
const router = express.Router();

router.get('/addproduct', productcontroller.addproductGet) // Show Add Form
router.post('/addproductcreate', uploadImage.single('image'), productcontroller.addproductPost) // Add Data to Form
router.get('/product', productcontroller.showproduct) // For to show Product List
router.get('/productdetails/:id', productcontroller.detailsproduct)//Product details page
router.get('/singleproductget/:id', productcontroller.singleproduct) //Single Product page
router.post('/updateproductpost/:id', uploadImage.single('image'), productcontroller.updateproduct)//Update Product
router.get('/deleteproductget/:id', productcontroller.deleteproduct);//Delete Product 
router.get('/productsearch', productcontroller.searchproduct) // For Searching product

module.exports = router;
