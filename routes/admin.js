const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

/* GET admin page. */
router.get('/', (req, res, next) => {
  const products = req.app.locals.products;
  res.render('admin', { products });
});

/* GET add product page. */
router.get('/add', (req, res, next) => {
  res.render('add-product');
});

/* POST add product. */
router.post('/add', (req, res, next) => {
  const products = req.app.locals.products;
  const { name, description, price, category, image } = req.body;
  const newProduct = {
    id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1,
    name,
    description,
    price: parseFloat(price),
    category,
    image
  };
  products.push(newProduct);

  fs.writeFile(path.join(__dirname, '..', 'data', 'products.json'), JSON.stringify(products, null, 2), (err) => {
    if (err) {
      return next(err);
    }
    res.redirect('/admin');
  });
});

/* GET edit product page. */
router.get('/edit/:id', (req, res, next) => {
  const products = req.app.locals.products;
  const productId = parseInt(req.params.id);
  const product = products.find(p => p.id === productId);
  if (!product) {
    return next(new Error('Product not found'));
  }
  res.render('edit-product', { product });
});

/* POST edit product. */
router.post('/edit/:id', (req, res, next) => {
  const products = req.app.locals.products;
  const productId = parseInt(req.params.id);
  const { name, description, price, category, image } = req.body;
  const productIndex = products.findIndex(p => p.id === productId);

  if (productIndex === -1) {
    return next(new Error('Product not found'));
  }

  products[productIndex] = {
    id: productId,
    name,
    description,
    price: parseFloat(price),
    category,
    image
  };

  fs.writeFile(path.join(__dirname, '..', 'data', 'products.json'), JSON.stringify(products, null, 2), (err) => {
    if (err) {
      return next(err);
    }
    res.redirect('/admin');
  });
});

/* POST delete product. */
router.post('/delete/:id', (req, res, next) => {
  let products = req.app.locals.products;
  const productId = parseInt(req.params.id);
  products = products.filter(p => p.id !== productId);
  req.app.locals.products = products;

  fs.writeFile(path.join(__dirname, '..', 'data', 'products.json'), JSON.stringify(products, null, 2), (err) => {
    if (err) {
      return next(err);
    }
    res.redirect('/admin');
  });
});

module.exports = router;