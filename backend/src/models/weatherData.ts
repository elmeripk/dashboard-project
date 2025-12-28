import dotenv from 'dotenv'
import { APIFetch } from './utils/fetchUtils';

import type {Request, Response} from 'express';
const WEATHER_KEY = process.env.OPENWEATHER_API_KEY;
//https://stackoverflow.com/questions/58567145/types-for-req-and-res-in-express
const BASE_URL = "https://pro.openweathermap.org";
const VERSION = "2.5";
const DATA_API_URL = new URL(`/data/${VERSION}/`, BASE_URL);
const ICON_API_URL = new URL(`/img/wn/`, BASE_URL);
const DEFAULT_LAT = '61.6315312';
const DEFAULT_LON = '23.5006679';
const UNITS = 'metric';



function constructWeatherAPIURL(suffix:string, params:Record<string, number | string>): URL{

    // Motivation for this:
    // https://dev.to/thdr/why-should-you-use-url-constructor-instead-of-template-literals-1gp0
    // https://techinsights.manisuec.com/javascript/template-strings-url-search-params/
    const currentWeatherURL = new URL(suffix, DATA_API_URL);

    const urlParams = new URLSearchParams({
        ...params,
        appid: WEATHER_KEY!,
        units: UNITS})

    currentWeatherURL.search = urlParams.toString();

    return currentWeatherURL;


}

async function getCurrentWeather(req:Request, res: Response){

    // How to get query params:
    // https://stackoverflow.com/questions/6912584/how-to-get-get-query-string-variables-in-express-js-on-node-js

    const lat = (req.query.lat ? req.query.lat : DEFAULT_LAT).toString();
    const lon = (req.query.lon ? req.query.lon : DEFAULT_LON).toString();
    const url = constructWeatherAPIURL('weather', {lat:lat, lon:lon});
    
    const response = await APIFetch(url, "An error ocurred while fetching weather data", 502);
    if ('error' in response){
        res.write(JSON.stringify(response));
        return;
    }
    
    // Rename speed to wind_speed
    const {
        weather:[{icon}], 
        main: {temp, feels_like}, 
        sys: {sunrise, sunset}, 
        name, 
        wind: {speed: wind_speed}
    } = response;
    
    const filteredWeather = {icon, temp, feels_like, sunrise, sunset, name, wind_speed};

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.write(JSON.stringify(filteredWeather));
    res.end();

    
}

export {getCurrentWeather};