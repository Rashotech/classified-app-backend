const httpStatus = require('http-status');
require('dotenv').config();

const verifyWebhook = (req, res, next) => {
    console.log("hit")
    if (req.headers['mono-webhook-secret'] !== process.env.MONO_WEBHOOK_SECRET) {
       throw ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized request')
    }
    next();
}

module.exports = verifyWebhook;