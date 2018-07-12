var express = require('express')

var router = express.Router()

var UserController = require('../../controllers/users.controller');


router.get('/', UserController.get)
router.post('/', UserController.create)
router.put('/', UserController.update)
router.delete('/:id',UserController.remove)

module.exports = router;