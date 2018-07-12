var express = require('express')

var router = express.Router()
var users = require('./api/users.route')

var AuthController = require('../controllers/auth.controller');

router.post('/authenticate', AuthController.authenticate)
router.post('/register', AuthController.register)
router.post('/forgotPassword', AuthController.forgotPassword)
router.post('/changePassword', AuthController.changePassword)

router.use('/users', users)
module.exports = router;