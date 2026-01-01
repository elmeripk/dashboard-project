import { Loadable } from "../loadable/Loadable";
import { APINameDayResponse } from "../../../../shared/schemas";
import { ValidatingFetcher } from "../../../../shared/utils/ValidatingFetcher";
import type z from "zod";
import type { Result } from "../../../../shared/types";

export class NameDayWidget extends Loadable {
    private container: HTMLElement;
    private searchDay: string = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    private apiUrl: string = "/api/v1/namedays";

    constructor(container: HTMLElement, contentElem: HTMLElement, loadElement: HTMLElement) {
        super(container, loadElement, contentElem);
        this.container = container;

        // Update every 24 hours
        setInterval(() => this.updateNameDays(), 86400000);

        // Initial fetch + render
        this.updateNameDays();
    }

    /** Allows changing the API endpoint */
    setUrl(url: string): void {
        this.apiUrl = url;
    }

    /** Fetches name days from API (pure, stateless) */
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
        if (!this.container) return;

        this.container.querySelector("#nameday-finnish")!.textContent =
            data.finnish.join(", ") || "N/A";

        this.container.querySelector("#nameday-swedish")!.textContent =
            data.swedish.join(", ") || "N/A";
    }

    /** Orchestrates fetch + render with loading state */
    private async updateNameDays(): Promise<void> {
        this.setLoading(true);
        const data = await this.fetchNameDays();
        this.renderNameDays(data);
        this.setLoading(false);
    }
}
