
import { DigitalClock } from './components/clock/DigitalClock'
import { WeatherWidget } from './components/weatherWidget/WeatherWidget';
(async function main(){
    
    new DigitalClock();

    const weatherContainer = document.querySelector<HTMLDivElement>("#weather-container");
    if(!weatherContainer){
        return;
    }

    await WeatherWidget.create(weatherContainer);

})();