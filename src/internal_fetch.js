require('dotenv').config({path: '../.env'});
const LAT = '61.607';
const LON = '23.870';
const WEATHERAPIKEY = process.env.WKEY;
const WEATHERAPIURL = `https://api.openweathermap.org/data/2.5/weather?lat=${LAT}&lon=${LON}&appid=${WEATHERAPIKEY}&lang=fi&units=metric`;
const DIGITRANSITAPIKEY = process.env.DKEY;
const allowedOrigins = ['http://localhost']; //replace with production domain!

const puppeteer = require('puppeteer');
  
async function fetchWeatherData(res, req){
    
    //if (!checkOrigin(req,res)) return;
    let response = await fetch(WEATHERAPIURL);
    let weatherData = await response.json();
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


    const parseBodyJson = req => {
        return new Promise((resolve, reject) => {
          let body = '';
      
          req.on('error', err => reject(err));
      
          req.on('data', chunk => {
            body += chunk.toString();
          });
      
          req.on('end', () => {
            resolve(JSON.parse(body));
          });
        });
      };

    //if (!checkOrigin(req,res)) return;
    let body = await parseBodyJson(req);
    let stop = body.stop
    let transportDest = body.destination;

    const dataToSend = {
        query: `{
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

    data3 = await fetch('https://api.digitransit.fi/routing/v1/routers/finland/index/graphql', {
        method:"POST",
        headers:{
            "Content-Type": "application/json",
            "digitransit-subscription-key": DIGITRANSITAPIKEY
        },
        body: JSON.stringify(dataToSend)
    })
    let received = await data3.json();
    const allTransports = received.data.stop.stoptimesWithoutPatterns;
    if(!allTransports){
        res.writeHead(404,{'Content-Type': 'application/json'});
        res.write("No trams that we know of");
        res.end();
        return;
    }
    const nextTransport = allTransports.find((tram) => tram.headsign === transportDest);
    const transportDataToSend = constructTramData(nextTransport);
    res.writeHead(200,{'Content-Type': 'application/json'});
    res.write(JSON.stringify(transportDataToSend));
    res.end();
}

async function fetchNameDayData(){

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto('https://www.paivyri.fi/info/nimipaivat/');
    //Wait for elements to load
    await page.waitForSelector('.cent_text');
    
    const names = await page.$$eval('p.cent_text', paragraphs => {
            const finnishCal = paragraphs[0].querySelectorAll('a');
            const swedishCal = paragraphs[1].querySelectorAll('a');
            const finnishNames = Array.from(finnishCal).map(name => name.textContent.trim());
            const swedishNames = Array.from(swedishCal).map(name => name.textContent.trim());
            const scrapedNames = [finnishNames, swedishNames];
            return scrapedNames;   
    });

    await browser.close();
};

function constructTramData(tramInfo){
    if (tramInfo === undefined){
        return null
    }

    let time = tramInfo.realtimeArrival;
    let day = tramInfo.serviceDay;
    let realTime = time+day
    let date = new Date(realTime * 1000);
    let timeAsLocal = date.toLocaleString('fi-FI');

    const tramData = { destination : tramInfo.headsign,
                       arrivalTime : `${date.getHours()}:${date.getMinutes()}`,
                       arrivalDay : `${date.getDate()}.${date.getMonth()+1}`
                     };
    return tramData;
}


module.exports = {fetchWeatherData, fetchStopData, fetchNameDayData};