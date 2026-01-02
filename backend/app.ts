import 'dotenv/config'
import express from 'express';
import weatherAPIRouter from './src/routes/weatherRoutes';
import nameDayAPIRouter from './src/routes/nameDayRoutes';

// Only if the .env is not in the same directory as app.js
//import dotenv from 'dotenv'
//dotenv.config({ path: '/custom/path/to/.env' })

// Project structure example:
// https://blog.logrocket.com/organizing-express-js-project-structure-better-productivity/



const PORT = Number(process.env.PORT) || 3000;
const HOST = process.env.HOST || "localhost";

const app = express();

app.use('/api/v1/weather/', weatherAPIRouter);
app.use('/api/v1/namedays/', nameDayAPIRouter);


app.listen(PORT, HOST, err => {
    if (err){
        console.log(err);
    }
})

