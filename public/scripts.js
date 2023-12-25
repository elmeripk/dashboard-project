async function getWeatherData(){

    const dataToSend = {
            query: "{stop(id: \"tampere:0510\") { name stoptimesWithoutPatterns { scheduledArrival realtimeArrival arrivalDelay scheduledDeparture realtimeDeparture departureDelay realtime realtimeState serviceDay headsign } } }"
      };
    
    data = await fetch('/weather-data');

    data3 = await fetch('https://api.digitransit.fi/routing/v1/routers/finland/index/graphql', {
        method:"POST",
        headers:{
            "Content-Type": "application/json",
            "digitransit-subscription-key": "b71cc1a424724f529d0bda043738770a"
        },
        body: JSON.stringify(dataToSend)
    })
    let received = await data3.json();
    let nextComer = received.data.stop.stoptimesWithoutPatterns;
    console.log(nextComer)
    let time = nextComer.realtimeArrival;
    let day = nextComer.serviceDay;
    let realTime = time+day
    var date = new Date(realTime * 1000);
    console.log(date.toLocaleString('fi-FI'));
    
    
}
getWeatherData()

/*

{
  stop(id: "tampere:0510") {
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
}
*/

