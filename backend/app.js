"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
var express_1 = require("express");
var weatherRoutes_1 = require("./src/routes/weatherRoutes");
// Only if the .env is not in the same directory as app.js
//import dotenv from 'dotenv'
//dotenv.config({ path: '/custom/path/to/.env' })
// Project structure example:
// https://blog.logrocket.com/organizing-express-js-project-structure-better-productivity/
var PORT = Number(process.env.PORT) || 3000;
var HOST = process.env.HOST || "localhost";
var app = (0, express_1.default)();
app.use('/api/v1/weather/', weatherRoutes_1.default);
app.listen(PORT, HOST, function (err) {
    console.log(err);
});
