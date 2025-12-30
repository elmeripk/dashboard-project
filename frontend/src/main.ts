
import { DigitalClock } from './components/clock/DigitalClock'
import { WeatherWidget } from './components/weatherWidget/WeatherWidget';
(async function main(){
    new DigitalClock();
    await WeatherWidget.create();

})();