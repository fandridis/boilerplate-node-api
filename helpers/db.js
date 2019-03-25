const mongoose = require('mongoose');
const config = require('config/keys');

mongoose.connect(process.env.MONGODB_URI || config.mongoURI, { useCreateIndex: true, useNewUrlParser: true });
mongoose.Promise = global.Promise;

module.exports = {
    User: require('../models/user.model'),
    Token: require('../models/token.model')
};