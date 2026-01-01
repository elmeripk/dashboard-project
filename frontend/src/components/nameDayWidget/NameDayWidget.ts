import { Loadable } from "../loadable/Loadable";
import { APINameDayResponse } from "../../../../shared/schemas";
import { ValidatingFetcher } from "../../../../shared/utils/ValidatingFetcher";
import type z from "zod";
import type { Result } from "../../../../shared/types";

export class NameDayWidget extends Loadable {
    private container: HTMLElement;
    private swedishNamesElem: HTMLElement | null;
    private finnishNamesElem: HTMLElement | null;

    //ISO date with the minutes, seconds and milliseconds removed
    private searchDay: string = new Date().toISOString().slice(0, 10);
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

        // Update every 24 hours
        setInterval(() => this.updateNameDays(), 86400000);

        this.updateNameDays();
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
        url.searchParams.set("date", this.searchDay);

        const result = await ValidatingFetcher.fetchAndValidateData(url, APINameDayResponse);
        
        if (result.error || !result.data) {
            const fallBack: z.infer<typeof APINameDayResponse> = {finnish: [], swedish: []};
            return fallBack;
        }

        return result.data;
    }

    /** Renders the name days into the DOM */
    private renderNameDays(data: z.infer<typeof APINameDayResponse>): void {
     
        if (!this.swedishNamesElem || !this.finnishNamesElem) {
            console.error("NameDayWidget: Cannot render name days, elements not found.");
            return;
        }

        this.swedishNamesElem.textContent = data.swedish.join(", ") || "N/A";
        this.finnishNamesElem.textContent = data.finnish.join(", ") || "N/A";
    }

    /** Orchestrates fetch + render with loading state */
    private async updateNameDays(): Promise<void> {
        this.setLoading(true);
        const data = await this.fetchNameDays();
        this.renderNameDays(data);
        this.setLoading(false);
    }
}
