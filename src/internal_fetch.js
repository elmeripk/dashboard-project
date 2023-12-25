require('dotenv').config({path: '../.env'});
const LAT = '61.607';
const LON = '23.870';
const WEATHERAPIKEY = process.env.WKEY;
const WEATHERAPIURL = `https://api.openweathermap.org/data/2.5/weather?lat=${LAT}&lon=${LON}&appid=${WEATHERAPIKEY}&lang=fi&units=metric`;
const DIGITRANSITAPIKEY = process.env.DKEY;
const allowedOrigins = ['http://locgalhost']; //replace with production domain!
  
async function fetchWeatherData(res, req){
    if (!checkOrigin(req)) return;
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

function checkOrigin(req){
    const requestOrigin = req.headers.origin;
    if(!allowedOrigins.includes(requestOrigin)){
        res.writeHead(403);
        res.write("Access outside the domain is not allowed");
        res.end();
        return false;
    }
    return true;
}

async function getStopData(res,req){
    if (!checkOrigin(req)) return;
    const dataToSend = {
        query: `{
            stop(id: "MATKA:3_0811") {
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
    console.log(received)
    let nextComer = received.data.stop.stoptimesWithoutPatterns[0];
    let tramData = {};
    
    if(!nextComer){
        res.writeHead(200,{'Content-Type': 'application/json'});
        res.write(JSON.stringify(tramData));
        res.end();
        return;
    }

    let time = nextComer.realtimeArrival;
    let day = nextComer.serviceDay;
    let realTime = time+day
    let date = new Date(realTime * 1000);
    let timeAsLocal = date.toLocaleString('fi-FI');
}

module.exports = {fetchWeatherData, getStopData};