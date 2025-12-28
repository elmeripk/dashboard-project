import express from 'express';
import { getCurrentWeather } from '../models/weatherData';

const weatherAPIRouter = express.Router();

weatherAPIRouter.get("/", (req, res) => {
    res.write("You reached the weather API");
    res.end();
}
)

weatherAPIRouter.get("/current-weather", getCurrentWeather);

export default weatherAPIRouter;

