const express = require('express');
const { getCart, addToCart } = require('../controllers/cartController');
const authenticate = require('../middlewares/authenticate');
const router = express.Router();

router.get('/', authenticate, getCart);
router.post('/', authenticate, addToCart);

module.exports = router;
