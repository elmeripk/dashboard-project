
import { DigitalClock } from './components/clock/DigitalClock'
import { NameDayWidget } from './components/nameDayWidget/NameDayWidget';
import { NameDayWidgetController } from './components/nameDayWidget/NameDayWidgetController';
import { WeatherWidget } from './components/weatherWidget/WeatherWidget';
import { WeatherWidgetController } from './components/weatherWidget/WeatherWidgetController';
import { ToastManager } from './components/toastWidget/toastManager';
import { ToastContainer } from './components/toastWidget/toastContainer';

(async function main(){
    
    const toastContainerElem = document.querySelector<HTMLElement>('#toast-container');
    const toastTemplateElem = document.querySelector<HTMLTemplateElement>('#toast-template');

    if (!toastContainerElem) {
        console.error('Main: Toast container element #toast-container not found.');
        return;
    }

    if (!toastTemplateElem) {
        console.error('Main: Toast template element #toast-template not found.');
        return;
    }

    const toastContainer = new ToastContainer(toastContainerElem, toastTemplateElem);
    ToastManager.initialize(toastContainer);

    new DigitalClock();

    const weatherContainer = document.querySelector<HTMLDivElement>("#weather-container");
    if(!weatherContainer){
        return;
    }

    const weatherPlaceholder = weatherContainer.querySelector<HTMLElement>(".loading");
    const weatherContent = weatherContainer.querySelector<HTMLElement>(".content");
    if (weatherContent && weatherPlaceholder) {
        const widget = new WeatherWidget(weatherContainer, weatherPlaceholder, weatherContent);
        await WeatherWidgetController.create(widget);
    }

    const nameDayContainer = document.querySelector<HTMLElement>("#nameday-container");

    if (!nameDayContainer) {
        return;
    }

    const nameDayPlaceholder = nameDayContainer.querySelector<HTMLElement>(".loading");
    
    const nameDayContent = nameDayContainer.querySelector<HTMLElement>(".content");

    if (nameDayContent && nameDayPlaceholder) {
        const nameDayWidget = new NameDayWidget(nameDayContainer, nameDayContent, nameDayPlaceholder);
        new NameDayWidgetController(nameDayWidget);
    }

    

})();