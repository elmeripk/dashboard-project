
import { DigitalClock } from './components/clock/DigitalClock'
import { WeatherWidget } from './components/weatherWidget/WeatherWidget';
(async function main(){
    
    new DigitalClock();

    const weatherContainer = document.querySelector<HTMLDivElement>("#weather-container");
    if(!weatherContainer){
        return;
    }

    const weatherPlaceholder = weatherContainer.querySelector<HTMLElement>(".loading");
    const weatherContent = weatherContainer.querySelector<HTMLElement>(".content");
    if (weatherContent && weatherPlaceholder) {
        WeatherWidget.create(weatherContainer, weatherPlaceholder, weatherContent);
    }

})();