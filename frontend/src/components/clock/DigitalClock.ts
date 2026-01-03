import type { Clock } from "./clockInterface";
import "./clock.css";

const DATEOPTIONS: Intl.DateTimeFormatOptions = {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
};

class DigitalClock implements Clock {
    container: HTMLElement;
    hoursMinutesElem: HTMLParagraphElement | null;
    secondsElem: HTMLParagraphElement | null;
    dateElem: HTMLParagraphElement | null;
    currDate: Date;

    constructor(container: HTMLElement = document.body) {
        this.container = container;
        this.hoursMinutesElem = this.container.querySelector<HTMLParagraphElement>("#clock-hours-minutes");
        this.secondsElem = this.container.querySelector<HTMLParagraphElement>("#clock-seconds");
        this.dateElem = this.container.querySelector<HTMLParagraphElement>("#date");
        this.currDate = new Date();
        this.advanceClockBySecond();
        
        setInterval(() => {
            this.currDate = new Date();
            this.advanceClockBySecond();
        }, 1000);

    };

    advanceClockBySecond(){

        const fullDate = this.currDate.toLocaleDateString(undefined, DATEOPTIONS);
        const hours = String(this.currDate.getHours()).padStart(2, '0');
        const minutes = String(this.currDate.getMinutes()).padStart(2,'0');
        const seconds = String(this.currDate.getSeconds()).padStart(2,'0');
        if (this.hoursMinutesElem) this.hoursMinutesElem.innerHTML = `${hours}:${minutes}`;
        if (this.secondsElem) this.secondsElem.textContent = `:${seconds}`;
        if (this.dateElem) this.dateElem.textContent = fullDate;

    };



}


export {DigitalClock};