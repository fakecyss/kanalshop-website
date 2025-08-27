const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  const products = req.app.locals.products;
  res.render('index', { products: products.slice(0, 4) });
});

router.get('/checkout', (req, res) => {
    res.render('checkout');
});

module.exports = router;