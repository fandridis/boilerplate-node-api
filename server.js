require('rootpath')();
const express = require('express');
const app = express();
const cors = require('cors');
const jwt = require('helpers/jwt');
const errorHandler = require('helpers/error-handler');

app.use(express.json());
app.use(cors());

// use JWT auth to secure the api
app.use(jwt());

// api routes
app.use('/users', require('./routes/user.routes'))

// global error handler
app.use(errorHandler);

// start server
const port = process.env.NODE_ENV === 'production' ? (process.env.PORT || 80) : 5000;
const server = app.listen(port, function () {
    console.log('Server listening on port ' + port);
});
