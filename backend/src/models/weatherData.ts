import {sendError, sendSuccess } from './utils/fetchUtils.js';
import { ValidatingFetcher } from '../../../shared/src/utils/ValidatingFetcher.js';
import type { Result } from '../../../shared/src/types.js';

import type {Request, Response} from 'express';
const WEATHER_KEY = process.env.OPENWEATHER_API_KEY;
//https://stackoverflow.com/questions/58567145/types-for-req-and-res-in-express
const BASE_URL = "https://api.openweathermap.org";
const VERSION = "2.5";
const DATA_API_URL = new URL(`/data/${VERSION}/`, BASE_URL);

const DEFAULT_LAT = '61.6315312';
const DEFAULT_LON = '23.5006679';
const UNITS = 'metric';

import { CurrentWeather } from './weatherSchemas.js';
import type z from 'zod';

function constructWeatherAPIURL(suffix:string, base:string = "", params:Record<string, number | string>  = {}): URL{

    // Motivation for this:
    // https://dev.to/thdr/why-should-you-use-url-constructor-instead-of-template-literals-1gp0
    // https://techinsights.manisuec.com/javascript/template-strings-url-search-params/
    const currentWeatherURL = new URL(suffix, base);

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
    const url = constructWeatherAPIURL('weather', DATA_API_URL.toString(), {lat:lat, lon:lon});
    
    const response: Result<z.infer<typeof CurrentWeather>> = await ValidatingFetcher.fetchAndValidateData(url, CurrentWeather);
    if (response.error || !response.data){
        sendError(`An error ocurred while fetching weather data: ${response.error}`, res, 500);
        return;
    }
    
    sendSuccess(response.data, res, 200);
   
}



export {getCurrentWeather};