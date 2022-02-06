const Joi = require('joi');
const { objectId } = require('./custom.validation');

const addListing = {
  body: Joi.object().keys({
    title: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().required(),
    postedBy: Joi.string().custom(objectId),
    category: Joi.string().custom(objectId),
    condition: Joi.string().required(),
    region: Joi.string().required(),
    lga: Joi.string().required(),
    exchange: Joi.boolean(),
    negotiable: Joi.boolean(),
    latitude: Joi.number(),
    longitude: Joi.number(),
  }),
};

const getListings = {
  params: Joi.object().keys({
    listingId: Joi.custom(objectId).required()
  })
};

const getListing = {
  query: Joi.object().keys({
    page: Joi.number().required(),
    size: Joi.number().required(),
    keyword: Joi.string(),
    region: Joi.string(),
    minprice: Joi.number(),
    maxprice: Joi.number(),
    category: Joi.string().custom(objectId),
    lga: Joi.string(),
  }),
};

const getListingsByCategory = {
  params: Joi.object().keys({
    categoryId: Joi.custom(objectId).required()
  }),
};

module.exports = {
    addListing,
    getListing,
    getListings,
    getListingsByCategory 
};