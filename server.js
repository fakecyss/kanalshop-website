require('dotenv').config();
const express = require('express');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
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

// MongoDB Session Store
const store = new MongoDBStore({
    uri: process.env.MONGODB_URI,
    collection: 'sessions'
});

// Catch errors
store.on('error', function(error) {
    console.error('MongoDB Session Store Error:', error);
});

// Session middleware
require('dotenv').config();
const express = require('express');
const session = require('express');
const MongoDBStore = require('connect-mongodb-session')(session);
const path = require('path');

const { MongoClient } = require('mongodb');

const indexRouter = require('./routes/index');
const productsRouter = require('./routes/products');
const cartRouter = require('./routes/cart');
const adminRouter = require('./routes/admin');

const app = express();
const port = 3000;

// MongoDB Session Store
const store = new MongoDBStore({
    uri: process.env.MONGODB_URI,
    collection: 'sessions'
});

// Catch errors
store.on('error', function(error) {
    console.error('MongoDB Session Store Error:', error);
});

// Session middleware
app.use(session({
    secret: process.env.SESSION_SECRET || 'a-default-secret',
    resave: false,
    saveUninitialized: false,
    store: store,
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

// MongoDB Connection and Product Loading
async function connectToDbAndLoadProducts() {
    const client = new MongoClient(process.env.MONGODB_URI);
    try {
        await client.connect();
        console.log('Connected to MongoDB');
        const db = client.db('shoeshop'); // <<< IMPORTANT: Use your actual database name here
        const productsCollection = db.collection('products'); // <<< IMPORTANT: Use your actual products collection name here
        const products = await productsCollection.find({}).toArray();
        app.locals.products = products;
        console.log('Products loaded from MongoDB');

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

    } catch (error) {
        console.error('Failed to connect to MongoDB or load products:', error);
        process.exit(1); // Exit if unable to connect to DB
    }
}

connectToDbAndLoadProducts();

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