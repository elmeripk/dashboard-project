const DATEOPTIONS: Intl.DateTimeFormatOptions = {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
};


function initClock(){
    
    const hoursMinutesElem = document.getElementById("clock-hours-minutes")! as HTMLParagraphElement;
    const secondsElem = document.getElementById("clock-seconds")! as HTMLParagraphElement;
    const dateElem = document.getElementById("date")! as HTMLParagraphElement;

    updateClock(new Date(), hoursMinutesElem, secondsElem, dateElem);
    
    setInterval(() => {
        updateClock(new Date(), hoursMinutesElem, secondsElem, dateElem)
    }, 1000);

}

function updateClock(
    date: Date, 
    hoursMinutesElem: HTMLParagraphElement, 
    secondsElem: HTMLParagraphElement, 
    dateElem: HTMLParagraphElement
){

    const fullDate = date.toLocaleDateString(undefined, DATEOPTIONS);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2,'0');
    const seconds = String(date.getSeconds()).padStart(2,'0');
    hoursMinutesElem.innerHTML = `${hours}:${minutes}`;
    secondsElem.textContent = `:${seconds}`
    dateElem.textContent = fullDate;

    


};



export {initClock};