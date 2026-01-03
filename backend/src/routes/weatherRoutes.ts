import express from 'express';
import { getCurrentWeather } from '../models/weatherData.js';

const weatherAPIRouter = express.Router();

weatherAPIRouter.get("/", (_, res) => {
    res.write("You reached the weather API");
    res.end();
}
)

weatherAPIRouter.get("/current-weather", getCurrentWeather);

export default weatherAPIRouter;

