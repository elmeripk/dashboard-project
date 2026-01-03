import { Loadable } from "../loadable/Loadable";
import { APINameDayResponse } from "../../../../shared/src/schemas";
import { ValidatingFetcher } from "../../../../shared/src/utils/ValidatingFetcher";
import type z from "zod";
import type { Result } from "../../../../shared/src/types";
import { SafeJSON } from "../../../../shared/src/utils/SafeJSON";

export class NameDayWidget extends Loadable {
    private container: HTMLElement;
    private swedishNamesElem: HTMLElement | null;
    private finnishNamesElem: HTMLElement | null;

    //sv-SE results in ISO formatted date with the minutes, seconds and milliseconds removed
    private searchDay: string = this.convertDateToMMDD(new Date());
    private apiUrl: string = "/api/v1/namedays";

    /**
     * Constructs a NameDayWidget instance
     * @param container The container element for the widget
     * @param contentElem Child element of the container housing the content (sibling to loading element)
     * @param loadElement The loading element within the container (sibling to content element)
     */
    constructor(container: HTMLElement, contentElem: HTMLElement, loadElement: HTMLElement) {
        
        super(container, loadElement, contentElem);
        this.container = container;
        const swedishElem = this.container.querySelector<HTMLElement>("#nameday-swedish-names");
        const finnishElem = this.container.querySelector<HTMLElement>("#nameday-finnish-names");

        if (!swedishElem || !finnishElem) {
            console.warn("NameDayWidget: Swedish or Finnish names element not found in the container.");
        }

        this.swedishNamesElem = swedishElem;
        this.finnishNamesElem = finnishElem;

        // Check for updates every minute
        setInterval(() => {
            
            const newSearchDay = this.convertDateToMMDD(new Date());

            // If the day has changed, update the name days and search day
            if (newSearchDay !== this.searchDay) {
                this.searchDay = newSearchDay;
                this.setNameDays();
            }
        }, 60000);

        this.setNameDays();
    }

    /** Allows changing the API endpoint */
    setUrl(url: string): void {
        this.apiUrl = url;
    }

    /**
     * Fetches Swedish and Finnish name days from the API
     * @returns A promise resolving to the name day data object. If an error occurs, returns an object with empty arrays.
     */
    private async fetchNameDays(): Promise<z.infer<typeof APINameDayResponse>> {
        const url = new URL(this.apiUrl, window.location.origin);
        const queryParams = {"date": this.searchDay}
        const result = await ValidatingFetcher.fetchAndValidateData(url, APINameDayResponse, queryParams);
        
        if (result.error || !result.data) {
            const fallBack: z.infer<typeof APINameDayResponse> = {finnish: [], swedish: [], date: this.searchDay};
            return fallBack;
        }

        return result.data;
    }

    /**
     * Updates the DOM elements with the fetched name days
     * @param data Name day data to render
     * @returns void
     */
    private renderNameDays(data: z.infer<typeof APINameDayResponse>): void {
     
        if (!this.swedishNamesElem || !this.finnishNamesElem) {
            console.error("NameDayWidget: Cannot render name days, elements not found.");
            return;
        }
        console.log("NameDayWidget: Rendering name days", data);
        this.swedishNamesElem.textContent = data.swedish.join(", ") || "N/A";
        this.finnishNamesElem.textContent = data.finnish.join(", ") || "N/A";
    }

    /** Gets name days and updates the DOM 
     * @postcondition Updates the DOM with fetched name days
    */
    private async setNameDays(): Promise<void> {
        this.setLoading(true);
        const data = await this.getNameDays();
        this.renderNameDays(data);
        this.setLoading(false);
    }

    /**
     * Gets name days, first trying session storage then falling back to API call
     * @returns Promise resolving to the name day data object
     * @postcondition Caches fetched data in session storage
     */
    private async getNameDays(): Promise<z.infer<typeof APINameDayResponse>> {

        const sessionResult = this.getNameDaysFromSession();
        const nowDate = this.convertDateToMMDD(new Date());

        // If there is no error and the data in the session storage is not stale
        // return cached
        if (!sessionResult.error && sessionResult.data && sessionResult.data.date === nowDate) {
            return Promise.resolve(sessionResult.data);
        }
        console.log("NameDayWidget: Fetching fresh name day data from API");
        const fetchedData = await this.fetchNameDays();

        // In case day changes while fetching
        const now = this.convertDateToMMDD(new Date());
        
        // The format is MM-DD, year does not matter for namedays
        if (now !== fetchedData.date) {
            // Fetch again for the current day
            const freshData = await this.getNameDays();
            this.storeNameDaysToSession(freshData);
            return freshData;
        }

        this.storeNameDaysToSession(fetchedData);
        return fetchedData;
    }

    /**
     * Retrieves name days from session storage if available and valid
     * @returns Result object containing name day data or error
     */
    private getNameDaysFromSession(): Result<z.infer<typeof APINameDayResponse>> {
        const sessionData = sessionStorage.getItem("namedays");
        if (!sessionData) {
            return {error: "No nameday data in cache", data: null};
        }

        const sessionResult = SafeJSON.parse(sessionData);
        if (sessionResult.error || !sessionResult.data) {
            return {error: "Failed to parse nameday data from cache", data: null};
        }

        const validated = APINameDayResponse.safeParse(sessionResult.data);
        if (!validated.success) {
            return {error: "No valid nameday data in cache", data: null};
        }
        return {data: validated.data, error: null};
    }

    /**
     * Stores name days data in session storage
     * @param data Name day data to store
     * @postcondition Data is serialized and saved in session storage
     */
    private storeNameDaysToSession(data: z.infer<typeof APINameDayResponse>): void {

        // Should always succeed since data is already validated
        const dataAsString = JSON.stringify(data);
        sessionStorage.setItem("namedays", dataAsString);
    }
    /**
     * Converts a Date object to MM-DD format without year or time
     * @param date Date object to convert
     * @returns Formatted date string in MM-DD format
     */
    private convertDateToMMDD(date: Date): string {
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${month}-${day}`;
    }

}
