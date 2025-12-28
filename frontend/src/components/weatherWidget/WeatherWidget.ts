

import type { WeatherResponse, UserLocation } from "../../types/responseTypes";

const FIVE_MINUTES_AS_MS = 300000;

export class WeatherWidget {

    userLocation: UserLocation | undefined;
    weatherContainer: Node | undefined;



    private constructor(){}

    private async init(): Promise<void>{
        const userLoc = await this.getUserLocation();
        if (userLoc) this.userLocation = userLoc;
        const template = document.querySelector<HTMLTemplateElement>("#weather-template");
        if(!template){
            return;
        }

        const weatherElem = template.content.cloneNode();
        
    }

    private async updateWeather(){
        const data = await this.fetchCurrentWeather();
    }

    // This static factory method is needed because the
    // initialization uses async/await and thus the initizalation
    // code cannot run in constructor
    // Inspired by:
    // https://dev.to/somedood/the-proper-way-to-write-async-constructors-in-javascript-1o8c
    static async create(){
        const widget = new WeatherWidget();
        widget.init();
        return widget;

    }
    
    //https://stackoverflow.com/questions/2707191/unable-to-cope-with-the-asynchronous-nature-of-navigator-geolocation
    
    /**
     * Gets the user's current location using the navigator API or cached if exists
     * @returns Promise wrapping the user's location or null on failed location retrieval
     */
    private async getUserLocation(): Promise<UserLocation | null> {
        
        // Try session storage first
        const cached = this.getPosFromSessionStorage();
        if (cached && Date.now() - cached.timestamp < FIVE_MINUTES_AS_MS) {
            return cached;
        }

        if (!("geolocation" in navigator)) return null;

        return new Promise((resolve) => {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const userPos: UserLocation = {
                        lat: pos.coords.latitude,
                        lon: pos.coords.longitude,
                        timestamp: Date.now()
                    };
                    this.storePosToSessionStorage(userPos);
                    resolve(userPos);
                },
                () => resolve(null)
            );
        });
    }

    private storePosToSessionStorage(loc: UserLocation){
        const posAsString = JSON.stringify(loc);
        sessionStorage.setItem("pos", posAsString);
    }

    /**
     * Fetches the user's stored location from session storage
     * to be sent to the weather API
     * @returns UserLocation if position is stored, otherwise null
     */
    private getPosFromSessionStorage(): UserLocation | null{

        const pos = sessionStorage.getItem("pos");
        if (!pos){
            return null
        }

        const userLoc: UserLocation = JSON.parse(pos);
        return userLoc;

    }

    private async fetchCurrentWeather(){
        const weatherRes = await fetch("/api/v1/weather/current-weather");
        if (!weatherRes)

        const weatherData = await weatherRes.json();
        if(weatherData)

        return weatherData;
    }

    private updateDom(){



    }
    

}




 