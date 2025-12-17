const {URL} = require('url');
const fs = require('fs')
const {fetchWeatherData, fetchStopData, fetchNameDayData} = require ('./utils/internal_fetch.js');
const {serveStatic} = require ('./utils/response_utils.js');
const HOMEPAGE = 'index.html';

function handleRequest(req,res){

    const { url, method, headers } = req;
    const filePath = new URL(url, `http://${headers.host}`).pathname;

    const fileName = filePath === '/' || filePath === '' ? HOMEPAGE : filePath;

    if (url === '/weather-data'){
        return fetchWeatherData(res);
    }else if (url === '/stop-data'){
        return fetchStopData(res,req);
    }else if (url === '/nameday-data'){
        return fetchNameDayData(res);
    }else{
        return serveStatic(fileName, res);
    }

}

module.exports = {handleRequest};
