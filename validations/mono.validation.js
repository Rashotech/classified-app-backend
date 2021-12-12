const Joi = require('joi');
const { objectId } = require('./custom.validation');

const getTransactions = {
  query: Joi.object().keys({
    start: Joi.string(),
    end: Joi.string(),
    type: Joi.string(),
    paginate: Joi.string(),
    narration: Joi.string(),
    limit: Joi.number(),
  }),
};

module.exports = {
    getTransactions 
};