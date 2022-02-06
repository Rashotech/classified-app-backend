const express = require('express');
const validate = require('../middleware/validate');
const multer = require("multer");
const { v4: uuidv4 } = require('uuid');

require('dotenv').config();

const adsValidation = require('../validations/ads.validation');
const adsController = require('../controllers/ads.controller');

const auth = require('../middleware/auth');
const router = express.Router();

const imageResize = require("../middleware/imageResize");

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpeg',
  'image/gif': 'gif',
  'image/jpg': 'jpg'
};


var storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, uuidv4() + '.' + ext);
  }
});

const upload = multer({
  limits : 5000000,
  storage: storage
});


router.post('/listings', auth(), upload.array("images", 4), validate(adsValidation.addListing), imageResize, adsController.addListing);
router.get('/listings', validate(adsValidation.getListing), adsController.getListings);
router.get('/listing/:listingId', validate(adsValidation.getListings), adsController.getListingById);
router.get('/listing/category/:categoryId', validate(adsValidation.getListingsByCategory), adsController.getListingsByCategory);
router.get('/mylisting', auth(), adsController.getListingByUser);
router.delete('/listing/delete/:listingId', auth(), validate(adsValidation.getListings), adsController.deleteListingById);

module.exports = router;