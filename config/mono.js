const { Mono } = require("mono-node");
require('dotenv').config();

const monoClient = new Mono({
    secretKey: process.env.MONO_SECRET_KEY
});

module.exports = {
    monoClient
};