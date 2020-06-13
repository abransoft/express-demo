const startupDebug = require('debug')('app:startup');
const dbDebug = require('debug')('app:db');
const config = require('config');
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const courses = require('./routes/courses');
const home = require('./routes/home');
const logger = require('./middleware/logger');

const app = express();

console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`app: ${app.get('env')}`);

// Using templating engine "pug" 
app.set('view engine', 'pug');
app.set('views', './views'); // default

// Built-in Middleware functions
app.use(express.json()); // json parser to req.body
app.use(express.urlencoded({ extended: true })); // reads html form data
app.use(express.static('public')); // serves static files

// Third-party Middleware functions
app.use(helmet()); // secure http headers
// Templating // placed below here together route '/' for learn purpose

// Configuration
console.log(`Application name: ${config.get('name')}`);
console.log(`Mail Server: ${config.get('mail.host')}`);
//console.log(`Mail Password: ${config.get('mail.password')}`);

if (app.get('env') === 'development') {
    app.use(morgan('tiny')); // http request logger
    startupDebug('Morgan enabled...');
}

// Custom Middleware function in a module
app.use(logger);

// Custom Middleware function
app.use((req, res, next) => {
    console.log('Authenticating...');
    next();
});

dbDebug('Connected to the database...'); // testing debug

// Routers
app.use('/api/courses', courses);
app.use('/', home);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
});

// Manual validation
/*if (!req.body.name || req.body.name.length < 3) {
    // 400 Bad Request
    res.status(400).send('Name is required and should be minimum 3 chars');
    return;
}*/

// 404
// Resource Not Found

/*app.get('/api/posts/:year/:month', (req, res) => {
    res.send(req.params);
    //res.send(req.query); // ?name=tal
});*/
