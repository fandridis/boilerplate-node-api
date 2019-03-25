const express = require('express');
const router = express.Router();
const userController = require('controllers/user.controller');
const config = require('config/keys');

// routes
router.post('/authenticate', authenticate);
router.post('/register', register);
router.get('/confirmNewUser/:token', confirmNewUser);
router.post('/forgotPassword', forgotPassword);
router.get('/validateResetPasswordToken/:token', validateResetPasswordToken);
router.post('/resetPassword', resetPassword);


// Not used yet
router.get('/current', getCurrent);
// router.get('/', getAll);
// router.get('/:id', getById);
// router.put('/:id', update);
// router.delete('/:id', _delete);

module.exports = router;

function authenticate(req, res, next) {
  console.log('@ authenticate @ routes');
  userController.authenticate(req.body)
    .then(user => res.json(user))
    .catch(err => next(err));
}

function register(req, res, next) {
  console.log('@ register @ routes');
    userController.register(req.body)
      .then(user => res.json(user))
      .catch(err => next(err));
}

function forgotPassword(req, res, next) {
	console.log('@ forgotPassword @ route');
		userController.forgotPassword(req.body)
      .then(() => res.json({ message: 'request successful' }))
      .catch(err => next(err));
}

function validateResetPasswordToken(req, res, next) {
	console.log('@ validateResetPasswordToken @ route');
		userController.validateResetPasswordToken(req.params.token)
      .then((msg) => res.json(msg))
      .catch(err => next(err));
}

function confirmNewUser(req, res, next) {
	console.log('@ confirmNewUser @ route');
		userController.confirmNewUser(req.params.token)
      .then((msg) => res.redirect(config.frontendUrl))
      .catch(err => next(err));
}

function resetPassword(req, res, next) {
	console.log('@ forgotPassword @ route');
		userController.resetPassword(req.body)
      .then(() => res.json({ message: 'change successful' }))
      .catch(err => next(err));
}

function getCurrent(req, res, next) {
    console.log('@ getCurrent @ route');
    userController.getById(req.user.sub)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

// function getAll(req, res, next) {
//     userController.getAll()
//         .then(users => res.json(users))
//         .catch(err => next(err));
// }

// function getById(req, res, next) {
//     userController.getById(req.params.id)
//         .then(user => user ? res.json(user) : res.sendStatus(404))
//         .catch(err => next(err));
// }

// function update(req, res, next) {
//     userController.update(req.params.id, req.body)
//         .then(() => res.json({}))
//         .catch(err => next(err));
// }

// function _delete(req, res, next) {
//     userController.delete(req.params.id)
//         .then(() => res.json({}))
//         .catch(err => next(err));
// }