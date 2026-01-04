import { WeatherWidget } from "./WeatherWidget";
import { APIWeatherResponse } from "../../../../shared/src/schemas";
import { ValidatingFetcher } from "../../../../shared/src/utils/ValidatingFetcher";
import * as z from "zod";
import { ToastManager } from "../toastWidget/toastManager";

const FIVE_MINUTES_AS_MS = 300_000;

const UserLocationSchema = z.object({
    lat: z.number(),
    lon: z.number(),
    timestamp: z.number(),
});

export type UserLocation = z.infer<typeof UserLocationSchema>;
export type WeatherResponse = z.infer<typeof APIWeatherResponse>;

export class WeatherWidgetController {
    private userLocation: UserLocation | null = null;
    private widget: WeatherWidget;

    private constructor(widget: WeatherWidget) {
        this.widget = widget;
    }

    /** Factory method to create controller + widget */
    static async create(widget: WeatherWidget) {
        const controller = new WeatherWidgetController(widget);
        await controller.init();
        return controller;
    }

    /** Initialize: get location, fetch weather */
    private async init() {
        this.widget.setLoading(true);
        this.userLocation = await this.getUserLocation();
        await this.updateWeather();
        this.widget.setLoading(false);
    }

    /** Update weather (fetch + render) */
    async updateWeather() {
        this.widget.setLoading(true);
        const data = await this.fetchCurrentWeather();
        if (data) this.widget.render(data);
        this.widget.setLoading(false);
    }

    /** Fetch weather from API */
    private async fetchCurrentWeather(): Promise<WeatherResponse | null> {
        const url = new URL("/api/v1/weather/current-weather", window.location.origin);
        
        const params: Record<string, string> = this.userLocation ? {
            lat: this.userLocation.lat.toString(),
            lon: this.userLocation.lon.toString(),
        } : {};

        const res = await ValidatingFetcher.fetchAndValidateData<WeatherResponse>(url, APIWeatherResponse, params);
        return res.data;
    }

    /** Get user location from cache or navigator */
    private async getUserLocation(): Promise<UserLocation | null> {
        const cached = this.getPosFromSessionStorage();
        if (cached && Date.now() - cached.timestamp < FIVE_MINUTES_AS_MS) return cached;

        if (!("geolocation" in navigator)) {
            ToastManager.getInstance().warning("Geolocation is not supported by your browser. Default location will be used.", 5000);
            return null;
        }

        return new Promise((resolve) => {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const userPos: UserLocation = {
                        lat: pos.coords.latitude,
                        lon: pos.coords.longitude,
                        timestamp: Date.now(),
                    };
                    this.storePosToSessionStorage(userPos);
                    resolve(userPos);
                },
                () => {
                    ToastManager.getInstance().warning("Unable to retrieve your location. Default location will be used.", 5000);
                    resolve(null);
                })
    });
    }

    private storePosToSessionStorage(loc: UserLocation) {
        sessionStorage.setItem("pos", JSON.stringify(loc));
    }

    private getPosFromSessionStorage(): UserLocation | null {
        const pos = sessionStorage.getItem("pos");
        if (!pos) return null;
        try {
            return UserLocationSchema.parse(JSON.parse(pos));
        } catch {
            return null;
        }
    }
}
