require('dotenv').config();
const express = require('express');
const session = require('express-session');
const path = require('path');
const fs = require('fs');

const indexRouter = require('./routes/index');
const productsRouter = require('./routes/products');
const cartRouter = require('./routes/cart');
const adminRouter = require('./routes/admin');

const app = express();
const port = 3000;

// Load product data
const products = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'products.json'), 'utf8'));
app.locals.products = products;

// Session middleware
app.use(session({
    secret: process.env.SESSION_SECRET || 'a-default-secret',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // for development purposes, set to true in production with HTTPS
}));

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Static files
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

// Middleware to pass cart to all views
app.use((req, res, next) => {
    res.locals.cart = req.session.cart || [];
    next();
});

// Routes
app.use('/', indexRouter);
app.use('/products', productsRouter);
app.use('/cart', cartRouter);
app.use('/admin', adminRouter);

// 404 handler
app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// Error handler
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: app.get('env') === 'development' ? err : {}
    });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});