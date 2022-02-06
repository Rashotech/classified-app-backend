require('dotenv').config();
const express = require('express');
const httpStatus = require('http-status');
const passport = require('passport');
const cors = require("cors");
const compression = require("compression");
const { jwtStrategy } = require('./config/passport');
const AuthRoutes = require('./routes/auth.route');
const AdsRoutes = require('./routes/ads.route');
const CategoryRoutes = require('./routes/category.route');
const ChatRoutes = require('./routes/message.route');

const ApiError = require('./utils/ApiError');
const { errorConverter, errorHandler } = require('./middleware/error');

var app = express();

// CORS
const corsOptions = {
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    optionsSuccessStatus: 204,
};  
app.use(cors(corsOptions));

// app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(compression());

app.use(express.static(__dirname + "/public"));
app.use("/uploads", express.static("uploads"));

// jwt authentication
app.use(passport.initialize());
passport.use('jwt', jwtStrategy);

app.use('/api/auth', AuthRoutes);
app.use('/api/ads', AdsRoutes);
app.use('/api/chat', ChatRoutes);
app.use('/api/category', CategoryRoutes);

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
    next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

module.exports = app;