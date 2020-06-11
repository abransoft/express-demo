const express = require('express');
const Joi = require('joi');
const helmet = require('helmet');
const morgan = require('morgan');
const logger = require('./logger');

const app = express();

// Built-in Middleware functions
app.use(express.json()); // json parser to req.body
app.use(express.urlencoded({ extended: true })); // reads html form data
app.use(express.static('public')); // serves static files

// Third-party Middleware functions
app.use(helmet()); // secure http headers
app.use(morgan('tiny')); // http request logger

// Custom Middleware function in a module
app.use(logger);

// Custom Middleware function
app.use((req, res, next) => {
    console.log('Authenticating...');
    next();
});

const courses = [
    { id: 1, name: 'course1' },
    { id: 2, name: 'course2' },
    { id: 3, name: 'course3' }
];

app.get('/api/courses', (req, res) => {
    res.send(courses);
});

app.get('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) {
        return res.status(404).send(`The course with the given ID=${req.params.id} was not found.`);
    }

    res.send(course);
});

app.post('/api/courses', (req, res) => {
    const { error } = validateCourse(req.body);
    if (error) {
        return res.send(400).send(error.details[0].message);
    }

    // Prepare
    const course = {
        id: courses.length + 1,
        name: req.body.name
    }

    // Add
    courses.push(course);
    res.send(course);
});

app.put('/api/courses/:id', (req, res) => {
    // Look up
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) {
        return res.status(404).send(`The course with the given ID=${req.params.id} was not found.`);
    }

    // Validate
    const { error } = validateCourse(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    // Update
    course.name = req.body.name;
    res.send(course);
});

app.delete('/api/courses/:id', (req, res) => {
    // Look up
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) {
        return res.status(404).send(`The course with the given ID=${req.params.id} was not found.`);
    }

    // Delete
    const index = courses.indexOf(course);
    courses.splice(index, 1);

    res.send(course);
});


function validateCourse(course) {
    const schema = {
        name: Joi.string().min(3).required()
    };

    return Joi.validate(course, schema);
}


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
