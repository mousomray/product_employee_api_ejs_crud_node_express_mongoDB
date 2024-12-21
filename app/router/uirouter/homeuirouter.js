const express = require('express');
const homecontroller = require('../../controller/uicontroller/homeuicontroller');
const router = express.Router();

router.get('/', homecontroller.home)

module.exports = router;
