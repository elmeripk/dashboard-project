const WEATHERURL = '/weather-data'
const STOPURL = '/stop-data'
const NAMEDAYURL = '/nameday-data'

const TULLIB = "tampere:0812";
const TULLIA = "tampere:0811"
const TRAMS = [{stop : TULLIB, destination : 'Hervanta'},
              {stop : TULLIB, destination : 'TAYS'},
              {stop : TULLIA, destination : 'Santalahti'},
              {stop : TULLIA, destination : 'Sorin aukio'}
             ]

async function getWeatherData(){
  return await sendFetchRequest(WEATHERURL)
}

function updateClock(oldDate){
  const date = new Date()
  const localDate = new Intl.DateTimeFormat('fi-FI', {timeZone: 'Europe/Helsinki', hour: 'numeric', minute: 'numeric', second: 'numeric' }).format(date);
  
  if(date.getHours() === 0) updateDate();
  //Update weather every hour
  if(date.getHours() > oldDate.getHours) updateWeather();
  //Update trams every 7 minutes
  if((date - oldDate) / (1000*60) > 7) updateTransports();
  
  //Courtesy of ChatGpt
  const newSeparatorDate = localDate.replace(/\./g, ":");
  const clockElement = document.getElementById('clock');
  clockElement.textContent = newSeparatorDate;

  return date;
 
};

function updateDate(){
  const date = new Date().toLocaleDateString('fi-FI', {weekday: 'long', day: 'numeric', month: 'long'});
  const dateElement = document.getElementById('date');
  dateElement.textContent = date;
}

async function updateNameDays(){
  const nameDayData = await sendFetchRequest(NAMEDAYURL);
    
  const finnishName = !nameDayData[0] ? "Ei nimipäiviä" : nameDayData[0].join();
  const swedishName = !nameDayData[1] ? "Inga namnsdagar" : nameDayData[1].join();
  const finnishNameElement = document.getElementById('finnish-names');
  const swedishNameElement = document.getElementById('swedish-names');
  finnishNameElement.textContent = finnishName;
  swedishNameElement.textContent = swedishName;
}

async function updateWeather(){
  const weatherData = await sendFetchRequest(WEATHERURL);
  const weatherIcon = document.getElementById("weather-icon")
  const weatherTemp = document.getElementById("temperature");
  const weatherSunrise = document.getElementById("sunrise");
  const weatherSunset = document.getElementById("sunset");
  const weatherWindspeed = document.getElementById("winspeed")
  // Set the src attribute of the img element
  
  if(weatherData){
    weatherIcon.src = "https://openweathermap.org/img/wn/" + weatherData.descIcon + "@2x.png";
    weatherTemp.innerText = weatherData.temp + "°C";
    const opts = { hour: "2-digit", minute: "2-digit" };
    const sunrise = new Date(weatherData.sunrise * 1000);
    const sunset = new Date(weatherData.sunset * 1000);
    weatherSunrise.innerText = "Auringonnousu: " + sunrise.toLocaleTimeString('fi-FI', opts);
    weatherSunset.innerText = "Auringonlasku: " + sunset.toLocaleTimeString('fi-FI', opts);
    weatherWindspeed.innerText = "Tuuli: " + weatherData.windSpeed + " m/s"
  }
}

async function updateTransports(){
  const tramData = TRAMS.map(tram => getStopData(tram))
  const resolved = await Promise.all(tramData)
    
  const tramContainers = Array.from(document.querySelectorAll('.tram-container'))
  for(let i=0;i<4;i++){
    
    const destination = TRAMS[i].destination;
    const containerToPopulate = tramContainers[i];
    const fillData = resolved[i]

    if(!fillData){
      containerToPopulate.innerText = destination + ": Ei tulevia ratikoita";
      continue
    } 
    let day = "Tänään ";
    let currentDate= new Date().toLocaleDateString('fi-FI', {day: 'numeric', month: 'numeric'}).slice(0, -1); // Remove the trailing dot
    
    if(fillData.arrivalDay != currentDate) day = "Huomenna ";
    
    containerToPopulate.innerText = TRAMS[i].destination + ": " + day + fillData.arrivalTime; 

  }
}

(async function populateDashboard(){
  
  let oldDate = new Date();
  updateClock(oldDate)
  
  setInterval(() => {
  oldDate = updateClock(oldDate);
  }, 1000);

  updateDate();
  updateNameDays();
  updateTransports();
  updateWeather()
    
})();

async function getStopData(transport){
    const data = transport
    
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      };

    return await sendFetchRequest(STOPURL,options)
   
}

async function getNameDayData(){
  return await sendFetchRequest(NAMEDAYURL)
}

async function sendFetchRequest(url,data){
  try{
      let response = "";
      
      //If no options are given, use default GET
      if(!data){
        response = await fetch(url);
      }else{
        response = await fetch(url,data);
      }

    if(response.ok){
      const data = await response.json();
      return data
    }else{
      return await response.text();
    }
        
  }catch(err){
    return null;
  }
}







