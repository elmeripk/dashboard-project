import type z from "zod";
import { APIWeatherResponse } from "../../../../shared/src/schemas";
import { Loadable } from "../loadable/Loadable";
import "./weatherWidget.css";

const BASE_URL = "https://openweathermap.org";
const DATE_FORMAT_OPTIONS: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit', hour12: false };
const ICON_API_URL = new URL("/img/wn/", BASE_URL);

export class WeatherWidget extends Loadable {
    private cityElem: HTMLElement | null = null;
    private tempElem: HTMLElement | null = null;
    private feelsLikeElem: HTMLElement | null = null;
    private descElem: HTMLElement | null = null;
    private sunriseElem: HTMLElement | null = null;
    private sunsetElem: HTMLElement | null = null;
    private windElem: HTMLElement | null = null;
    private iconElem: HTMLImageElement | null = null;

    constructor(container: HTMLDivElement, loadingElement: HTMLElement, contentElement: HTMLElement) {
        super(container, loadingElement, contentElement);
        this.cacheElements(container);
    }

    /** Cache all DOM elements and warn if missing */
    private cacheElements(container: HTMLDivElement) {
        const assignElem = <T extends HTMLElement>(selector: string): T | null => {
            const elem = container.querySelector<T>(selector) ?? null;
            if (!elem) console.warn(`WeatherWidget: Element '${selector}' not found in container.`);
            return elem;
        };

        this.cityElem = assignElem<HTMLElement>("#weather-city-name");
        this.tempElem = assignElem<HTMLElement>("#weather-temperature");
        this.feelsLikeElem = assignElem<HTMLElement>("#weather-feels-like");
        this.descElem = assignElem<HTMLElement>("#weather-description");
        this.sunriseElem = assignElem<HTMLElement>("#weather-sunrise");
        this.sunsetElem = assignElem<HTMLElement>("#weather-sunset");
        this.windElem = assignElem<HTMLElement>("#weather-wind");
        this.iconElem = assignElem<HTMLImageElement>("#weather-icon");
    }

    /** Render weather data safely */
    render(data: z.infer<typeof APIWeatherResponse>) {
        const sunRise = data.sunrise ? new Date(data.sunrise * 1000).toLocaleTimeString([], DATE_FORMAT_OPTIONS) : "N/A";
        const sunSet = data.sunset ? new Date(data.sunset * 1000).toLocaleTimeString([], DATE_FORMAT_OPTIONS) : "N/A";

        if (this.cityElem) this.cityElem.textContent = `Weather in ${data.name ?? "N/A"}`;
        if (this.tempElem) this.tempElem.textContent = `${data.temp ?? "N/A"}°C`;
        if (this.feelsLikeElem) this.feelsLikeElem.textContent = `Feels like: ${data.feels_like ?? "N/A"}°C`;
        if (this.descElem) this.descElem.textContent = data.description ?? "N/A";
        if (this.sunriseElem) this.sunriseElem.textContent = sunRise;
        if (this.sunsetElem) this.sunsetElem.textContent = sunSet;
        if (this.windElem) this.windElem.textContent = `${data.wind_speed ?? "N/A"} m/s`;

        if (this.iconElem) {
            this.iconElem.src = data.icon ? new URL(`${data.icon}@4x.png`, ICON_API_URL).toString() : "";
            this.iconElem.alt = data.description ?? "Weather icon";
        }
    }
}
