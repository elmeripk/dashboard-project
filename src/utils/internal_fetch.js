const path = require('path');
const upmostDir = path.dirname(path.dirname(__dirname));
const dotenvPath = path.join(upmostDir, '.env');
require('dotenv').config({path: dotenvPath});

const {parseRequestBody} = require('./request_utils');

const LAT = '61.607';
const LON = '23.870';
const WEATHERAPIKEY = process.env.WKEY;
const STOPURL = 'https://api.digitransit.fi/routing/v1/routers/finland/index/graphql';
const WEATHERAPIURL = `https://api.openweathermap.org/data/2.5/weather?lat=${LAT}&lon=${LON}&appid=${WEATHERAPIKEY}&lang=fi&units=metric`;
const DIGITRANSITAPIKEY = process.env.DKEY;
const allowedOrigins = ['http://localhost']; //replace with production domain!

const puppeteer = require('puppeteer');

async function fetchWeatherData(res){
    
    //if (!checkOrigin(req,res)) return;
    try{
        const weatherResponse = await fetch(WEATHERAPIURL);

        let weatherData = await weatherResponse.json();
        const temp = weatherData.main.temp
        const sunrise = weatherData.sys.sunrise
        const sunset = weatherData.sys.sunset
        const desc = weatherData.weather[0].description
        const descIcon = weatherData.weather[0].icon
        const windSpeed = weatherData.wind.speed

        const filteredData = {temp : temp,
                          sunrise : sunrise,
                          sunset : sunset,
                          windSpeed : windSpeed,
                          desc : desc,
                          descIcon : descIcon
                        }
        res.writeHead(200, {'Content-Type':'application/json'});
        res.write(JSON.stringify(filteredData));
        res.end()
    }catch(error){
        return onApiError(res);
    }
}

/*
function checkOrigin(req,res){
    const requestOrigin = req.headers['Origin'];
    console.log(requestOrigin)
    if(!allowedOrigins.includes(requestOrigin)){
        res.writeHead(403);
        res.write("Access outside the domain is not allowed");
        res.end();
        return false;
    }
    return true;
}*/

async function fetchStopData(res,req){

    try {
        let apiRes = "";
        let bodyData = await parseRequestBody(req);
        let stop = bodyData.stop
        let transportDest = bodyData.destination;
        
        try{
            const dataToSend = createTransitQuery(stop);
            apiRes = await fetch(STOPURL, {
            method:"POST",
            headers:{
                "Content-Type": "application/json",
                "digitransit-subscription-key": DIGITRANSITAPIKEY
            },
            body: JSON.stringify(dataToSend)
        })
        
        const received = await apiRes.json();

        //Connecting is successful but the API returns an error
        if(apiRes.status !== 200) return onApiError(res, apiRes);
       
        const allTransports = received.data.stop.stoptimesWithoutPatterns;
        
        //If the API provides no transports
        if(!allTransports){
            res.writeHead(404,{'Content-Type': 'application/json'});
            res.write("No trams that we know of");
            res.end();
            return;
        }
        //Find the first transport that matches the destination
        const nextTransport = allTransports.find((tram) => tram.headsign === transportDest);
        const transportDataToSend = constructTramData(nextTransport);
        res.writeHead(200,{'Content-Type': 'application/json'});
        res.write(JSON.stringify(transportDataToSend));
        res.end();
        
        //Catch connection errors 
        }catch(error){
            return onApiError(res, apiRes);
        }
    
    // Catch client-server error
    } catch (error) {
        res.writeHead(400, {'Content-Type':'text/plain'});
        res.write("An error between the client and the server has occured");
        res.end();
    }  
 
}

async function fetchNameDayData(res){

    const browser = await puppeteer.launch();
    try{
        
        const page = await browser.newPage();

        await page.goto('https://www.paivyri.fi/info/nimipaivat/');
        //Wait for elements to load
        await page.waitForSelector('.cent_text');
        
        //Returns an array of elements that match the selector
        const names = await page.$$eval('p.cent_text', paragraphs => {
        
            //The first element contains the Finnish names, the second the Swedish names
            const finnishCalendar = paragraphs[0].querySelectorAll('a');
            const swedishCalendar = paragraphs[1].querySelectorAll('a');
        
            //Map the elements to their text content and trim the whitespace
            //If the name doesn't exist, return null
            const finnishNames = Array.from(finnishCalendar).map(name => !name ? null : name.textContent.trim());
            const swedishNames = Array.from(swedishCalendar).map(name => !name ? null : name.textContent.trim());
            return [finnishNames, swedishNames];
        }); 

        await browser.close();
        res.writeHead(200, {'Content-Type':'application/json'});
        res.write(JSON.stringify(names));
        res.end();

    }catch(error){
        await browser.close();
        res.writeHead(500, {'Content-Type':'text/plain'});
        res.write("Unable to fetch the namedays");
        res.end();
    }
    
};

function constructTramData(tramInfo){
    
    if (tramInfo === undefined) return null;
    
    const time = tramInfo.realtimeArrival;
    const day = tramInfo.serviceDay;
    const realTime = time+day
    const date = new Date(realTime * 1000);
    const timeAsLocal = date.toLocaleString('fi-FI');

    const tramData = { destination : tramInfo.headsign,
                       arrivalTime : `${date.getHours()}:${date.getMinutes()}`,
                       arrivalDay : `${date.getDate()}.${date.getMonth()+1}`
                     };
    return tramData;
}

function onApiError(res){
    res.writeHead(404, {'Content-Type' : 'text/plain'});
    res.write('There was an error getting data from the API (either the data is not in the correct format or the API is down)');
    res.end();
}

function createTransitQuery(stop){
    return { query :`{
        stop(id: "${stop}") {
            name
            stoptimesWithoutPatterns {
            scheduledArrival
            realtimeArrival
            arrivalDelay
            scheduledDeparture
            realtimeDeparture
            departureDelay
            realtime
            realtimeState
            serviceDay
            headsign
        }
    }
}`
}
}

module.exports = {fetchWeatherData, fetchStopData, fetchNameDayData};