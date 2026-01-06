// https://medium.com/@sohamdas.nest/why-dotenv-config-doesnt-work-in-nested-modules-and-how-to-fix-it-in-node-js-8cbfab85392b
import 'dotenv/config';
import express from 'express';
import weatherAPIRouter from './routes/weatherRoutes.js';
import nameDayAPIRouter from './routes/nameDayRoutes.js';
import transitAPIRouter from './routes/transitRoutes.js';

// Project structure example:
// https://blog.logrocket.com/organizing-express-js-project-structure-better-productivity/


const PORT = Number(process.env.PORT) || 3000;
const HOST = process.env.HOST || "localhost";

console.log("API KEY IS:", process.env.OPENWEATHER_API_KEY);
console.log('cwd:', process.cwd());


const app = express();

app.use('/api/v1/weather', weatherAPIRouter);
app.use('/api/v1/namedays', nameDayAPIRouter);
app.use('/api/v1/transit', transitAPIRouter);


app.listen(PORT, HOST, err => {
    if (err){
        console.log(err);
    }
})

