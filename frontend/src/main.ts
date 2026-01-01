
import { DigitalClock } from './components/clock/DigitalClock'
import { NameDayWidget } from './components/nameDayWidget/NameDayWidget';
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

    const nameDayContainer = document.querySelector<HTMLElement>("#nameday-container");

    if (!nameDayContainer) {
        return;
    }

    const nameDayPlaceholder = nameDayContainer.querySelector<HTMLElement>(".loading");
    const nameDayContent = nameDayContainer.querySelector<HTMLElement>(".content");
    if (nameDayContent && nameDayPlaceholder) {
        new NameDayWidget(nameDayContainer, nameDayContent, nameDayPlaceholder);
    }

})();