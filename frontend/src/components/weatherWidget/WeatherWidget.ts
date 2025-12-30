

import { APIWeatherResponse } from "../../../../shared/weatherSchemas";
import { updateTextContent, updateElementAttribute } from "../../utils/domUtils";
import * as z from "zod";

const BASE_URL = "https://openweathermap.org";
const ICON_API_URL = new URL(`/img/wn/`, BASE_URL);
const DATE_FORMAT_OPTIONS: Intl.DateTimeFormatOptions = {hour: '2-digit', minute:'2-digit', hour12: false};

type WeatherResponse = z.infer<typeof APIWeatherResponse>;

const UserLocationSchema = z.object({
    lat: z.number(),
    lon: z.number(),
    timestamp: z.number(),
});

type UserLocation = z.infer<typeof UserLocationSchema>;

const FIVE_MINUTES_AS_MS = 300000;

export class WeatherWidget {

    userLocation: UserLocation | undefined;
    weatherContainer: HTMLDivElement | undefined;
    currentWeather: WeatherResponse | undefined;

    private constructor(){}

    private async init(): Promise<void>{
        
        const weatherContainer = document.querySelector<HTMLDivElement>("#weather-container");
        
        if(!weatherContainer){
            return;
        }

        this.weatherContainer = weatherContainer;
        const userLoc = await this.getUserLocation();
        if (userLoc) this.userLocation = userLoc;
    
        await this.updateWeather();
        
    }

    /**
     * Toggles the loading state of the weather widget
     * @param loading Whether to show the loading message or not
     */
    private setLoading(loading: boolean) {
      const container = this.weatherContainer;
      if (!container) return;
      loading ? container.classList.add("is-loading") : container.classList.remove("is-loading");
    }
    
    
    private async updateWeather(){

        this.setLoading(true);

        const data = await this.fetchCurrentWeather();
        if (!data || !this.weatherContainer){
            return;
        }
        this.currentWeather = data;


        const sunRiseLocalTime = data.sunrise ? new Date(data.sunrise * 1000).toLocaleTimeString([], DATE_FORMAT_OPTIONS) : "N/A";
        const sunSetLocalTime = data.sunset ? new Date(data.sunset * 1000).toLocaleTimeString([], DATE_FORMAT_OPTIONS) : "N/A";

        updateTextContent("#weather-city-name", data.name ?? "N/A", this.weatherContainer);
        updateTextContent("#weather-temperature", `${data.temp ?? "N/A"}°C`, this.weatherContainer);
        updateTextContent("#weather-feels-like", `Feels like: ${data.feels_like ?? "N/A"}°C`, this.weatherContainer);
        updateTextContent("#weather-description", data.description ?? "N/A", this.weatherContainer);
        updateTextContent("#weather-sunrise", `${sunRiseLocalTime}`, this.weatherContainer);
        updateTextContent("#weather-sunset", `${sunSetLocalTime}`, this.weatherContainer);
        updateTextContent("#weather-wind", `${data.wind_speed ?? "N/A"} m/s`, this.weatherContainer);

        const scale = "4x";
        // See: https://openweathermap.org/weather-conditions

        // If icon is missing, set empty string to remove previous icon
        // The alt text will be shown instead and no crash occurs
        const iconURLSuffix = data.icon ? `${data.icon}${scale !== "" ? '@' + scale : ""}.png` : "";
        const iconUrl = new URL(iconURLSuffix, ICON_API_URL).toString();

        updateElementAttribute("#weather-icon", "src", iconUrl, this.weatherContainer);
        updateElementAttribute("#weather-icon", "alt", data.description ?? "Weather icon", this.weatherContainer);

        this.setLoading(false);

    }

    // This static factory method is needed because the
    // initialization uses async/await and thus the initizalation
    // code cannot run in constructor
    // Inspired by:
    // https://dev.to/somedood/the-proper-way-to-write-async-constructors-in-javascript-1o8c
    static async create(){
        const widget = new WeatherWidget();
        await widget.init();
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
        try {
            return UserLocationSchema.parse(JSON.parse(pos));
        }
        catch (e){
            return null;
        }
        
    }

    /**
     * Fetches the current weather from the backend API according to user's location
     * @returns Validated WeatherResponse or null on failure
     */
    private async fetchCurrentWeather(): Promise<WeatherResponse | null>{

        const url = new URL("/api/v1/weather/current-weather", window.location.origin);

        // In case user denied location access, do not append lat/lon params
        if (this.userLocation){
            url.searchParams.append("lat", this.userLocation.lat.toString());
            url.searchParams.append("lon", this.userLocation.lon.toString());
        }

        const weatherRes = await fetch(url.toString());

        if (!weatherRes.ok){
            return null;
        }

        try {
            // safeParse does not throw but rather returns an object indicating success or failure
            const weatherData = APIWeatherResponse.parse(await weatherRes.json());
            return weatherData;
        }
        catch (e){
            return null;
        }
        
    }

    
}




 