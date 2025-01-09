const express = require('express');
const { checkout } = require('../controllers/paymentController');
const authenticate = require('../middlewares/authenticate');
const router = express.Router();

router.post('/checkout', authenticate, checkout);

module.exports = router;