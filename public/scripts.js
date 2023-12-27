async function getWeatherData(){
    const weatherData = await fetch('/weather-data');  
}

(async function getStopData(){
    const stopUrl = '/stop-data'
    const tullib = "tampere:0812";
    const tullia = "tampere:0811"
    const data = {stop : tullib, destination : 'Hervanta'};
    //const nextTays = await fetch(stopUrl, {method : 'POST', body : {line : tullib, destination : 'TAYS'}});
    const nextHervanta = await fetch(stopUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
    //const nextSori = await fetch(stopUrl, {body : {line : tullia, destination : 'Sorin aukio'}});
   // const nextSantalahti = await fetch(stopUrl, {body : {line : tullia, destination : 'Santalahti'}});
    console.log(await nextHervanta.json())
}())





