const express = require('express');
// const validate = require('../middleware/validate');

// const adsValidation = require('../validations/ads.validation');
const categoryController = require('../controllers/category.controller');

const auth = require('../middleware/auth');
const router = express.Router();

// router.post('/addlisiting', auth(), validate(adsValidation.addListing), adsController.addListing);
router.get('/', categoryController.getCategories);
// router.get('/listing/:listingId', validate(adsValidation.getListings), adsController.getListingById);
// router.get('/listing/category/:categoryId', validate(adsValidation.getListingsByCategory), adsController.getListingsByCategory);
// router.get('/mylisting', auth(), adsController.getListingByUser);
// router.delete('/listing/delete/:listingId', auth(), validate(adsValidation.getListings), adsController.deleteListingById);

module.exports = router;