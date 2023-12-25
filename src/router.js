const URL = require('url');
const fs = require('fs')
const {fetchWeatherData, getStopData} = require ('./internal_fetch.js');


const allowedMethods = {
    '/api/register': ['POST'],
    '/api/users': ['GET'],
    '/api/products': ['GET']
  };

function handleRequest(req,res){

    const { url, method, headers } = req;
    let htmlFile;
    if (url.endsWith('.css')) {
        res.writeHead(200, { 'Content-Type': 'text/css' });
        const cssContent = fs.readFileSync('../public/styles.css');
        res.write(cssContent);
    } 
    else if(url.endsWith('projects/dashboard')){
        htmlFile = fs.readFileSync('../public/dashboard.html');
        res.writeHead(200, { 'Content-Type':'text/html'})
        res.write(htmlFile);
    }else if(url.endsWith('scripts.js')){
        let jsFile = fs.readFileSync('../public/scripts.js');
        res.writeHead(200, {'Content-Type':'text/javascript'});
        res.write(jsFile);
    }else if(url === '/weather-data'){
        //fetchWeatherData(res);
        getStopData(res,req);
        return;
    }else{
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.write("This page does not exist");
    }
    res.end();
    
}

module.exports = {handleRequest};
