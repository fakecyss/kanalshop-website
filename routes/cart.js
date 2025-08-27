const express = require('express');
const router = express.Router();

/* GET cart page. */
router.get('/', (req, res, next) => {
  res.render('cart');
});

/* POST to add to cart. */
router.post('/add/:id', (req, res, next) => {
  const products = req.app.locals.products;
  const productId = parseInt(req.params.id);
  const product = products.find(p => p.id === productId);

  if (product) {
    const cart = req.session.cart || [];
    const existingProduct = cart.find(item => item.id === productId);

    if (existingProduct) {
        existingProduct.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    req.session.cart = cart;
  }

  const backUrl = req.header('Referer') || '/products';
  res.redirect(backUrl);
});

/* POST to update cart. */
router.post('/update/:id', (req, res, next) => {
  const productId = parseInt(req.params.id);
  const quantity = parseInt(req.body.quantity);
  let cart = req.session.cart || [];

  const itemIndex = cart.findIndex(item => item.id === productId);

  if (itemIndex !== -1) {
      if (quantity > 0) {
          cart[itemIndex].quantity = quantity;
      } else {
          cart.splice(itemIndex, 1);
      }
  }
  
  req.session.cart = cart;
  res.redirect('/cart');
});

/* POST to remove from cart. */
router.post('/remove/:id', (req, res, next) => {
  const productId = parseInt(req.params.id);
  let cart = req.session.cart || [];

  cart = cart.filter(item => item.id !== productId);

  req.session.cart = cart;
  res.redirect('/cart');
});

module.exports = router;