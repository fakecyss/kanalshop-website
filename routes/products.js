const express = require('express');
const router = express.Router();

const PRODUCTS_PER_PAGE = 6;

/* GET products page. */
router.get('/', (req, res, next) => {
  const products = req.app.locals.products;
  const categories = [...new Set(products.map(p => p.category))];
  const selectedCategory = req.query.category;
  const sortOption = req.query.sort;
  const page = parseInt(req.query.page) || 1;

  let filteredProducts = products;
  if (selectedCategory) {
    filteredProducts = products.filter(p => p.category === selectedCategory);
  }

  if (sortOption === 'price-asc') {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sortOption === 'price-desc') {
    filteredProducts.sort((a, b) => b.price - a.price);
  }

  const totalProducts = filteredProducts.length;
  const totalPages = Math.ceil(totalProducts / PRODUCTS_PER_PAGE);
  const startIndex = (page - 1) * PRODUCTS_PER_PAGE;
  const endIndex = page * PRODUCTS_PER_PAGE;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  res.render('products', { 
    products: paginatedProducts, 
    categories, 
    selectedCategory, 
    sortOption,
    currentPage: page,
    totalPages
  });
});

/* GET search results. */
router.get('/search', (req, res, next) => {
  const products = req.app.locals.products;
  const query = req.query.q;
  const page = parseInt(req.query.page) || 1;

  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(query.toLowerCase()));
  const categories = [...new Set(products.map(p => p.category))];

  const totalProducts = filteredProducts.length;
  const totalPages = Math.ceil(totalProducts / PRODUCTS_PER_PAGE);
  const startIndex = (page - 1) * PRODUCTS_PER_PAGE;
  const endIndex = page * PRODUCTS_PER_PAGE;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  res.render('products', { 
    products: paginatedProducts, 
    categories, 
    selectedCategory: null,
    sortOption: null,
    currentPage: page,
    totalPages,
    searchQuery: query
  });
});

/* GET product page. */
router.get('/:id', (req, res, next) => {
  const products = req.app.locals.products;
  const productId = parseInt(req.params.id);
  const product = products.find(p => p.id === productId);
  if (product) {
      res.render('product', { product });
  } else {
      const err = new Error('Product not found');
      err.status = 404;
      next(err);
  }
});

module.exports = router;