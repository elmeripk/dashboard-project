import { Loadable } from "../loadable/Loadable";
import type { APINameDayResponse } from "../../../../shared/src/schemas";
import type z from "zod";
import "./NameDayWidget.css"

export class NameDayWidget extends Loadable {
    private container: HTMLElement;
    private swedishNamesElem: HTMLElement | null;
    private finnishNamesElem: HTMLElement | null;

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
    }

    /**
     * Updates the DOM elements with the fetched name days
     * @param data Name day data to render
     * @returns void
     */
    renderNameDays(data: z.infer<typeof APINameDayResponse>): void {
        if (!this.swedishNamesElem || !this.finnishNamesElem) {
            console.error("NameDayWidget: Cannot render name days, elements not found.");
            return;
        }
        this.swedishNamesElem.textContent = data.swedish.join(", ") || "N/A";
        this.finnishNamesElem.textContent = data.finnish.join(", ") || "N/A";
    }

    /**
     * Shows or hides the loading indicator
     * @param isLoading Whether to show loading state
     */
    showLoading(isLoading: boolean): void {
        this.setLoading(isLoading);
    }
}