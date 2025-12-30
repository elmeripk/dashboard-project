import type { Clock } from "./clockInterface";

const DATEOPTIONS: Intl.DateTimeFormatOptions = {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
};

class DigitalClock implements Clock {
    hoursMinutesElem: HTMLParagraphElement;
    secondsElem: HTMLParagraphElement;
    dateElem: HTMLParagraphElement;
    currDate: Date;

    constructor(){
        this.hoursMinutesElem = document.getElementById("clock-hours-minutes")! as HTMLParagraphElement;
        this.secondsElem = document.getElementById("clock-seconds")! as HTMLParagraphElement;
        this.dateElem = document.getElementById("date")! as HTMLParagraphElement;
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
        this.hoursMinutesElem.innerHTML = `${hours}:${minutes}`;
        this.secondsElem.textContent = `:${seconds}`
        this.dateElem.textContent = fullDate;

    };



}


export {DigitalClock};