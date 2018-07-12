var express = require('express')

var router = express.Router()

var ListingController = require('../../controllers/listing.controller');


router.get('/', ListingController.get)
router.post('/', ListingController.create)
router.put('/', ListingController.update)
router.delete('/:id',ListingController.remove)

module.exports = router;