import "./transitWidget.css"
import { APITransitStopResponse, APITransitScheduleResponse } from "../../../../shared/src/schemas";
import type z from "zod";

// In the future, abstract these away to a common file
type StopList = z.infer<typeof APITransitStopResponse>;
type ScheduleResponse = z.infer<typeof APITransitScheduleResponse>;


class TransitWidget {
    private content: HTMLElement;
    private listContainer: HTMLElement | null = null;
    private listItems: HTMLElement[] = [];
    private inputElement: HTMLInputElement | null = null;
    private datalistElement: HTMLDataListElement | null = null;

    constructor(container: HTMLElement) {
        this.content = container;
        this.cacheElements();
    }


    /**
     * Cache elements used in the widget
     */
    private cacheElements(): void {
        const listContainer = this.content.querySelector<HTMLElement>("#transit-stops");
        if (!listContainer) {
            console.warn("TransitWidget: List container element not found in the container.");
        }else{
            this.listContainer = listContainer;
            this.listItems = Array.from(listContainer.querySelectorAll<HTMLElement>("div.arrival-entry"));
            if(this.listItems.length !== 3) {
                console.warn("TransitWidget: Expected 3 list items for next arrivals, found ", this.listItems.length);
            }
        }

        this.listContainer = listContainer;

        this.inputElement = this.content.querySelector<HTMLInputElement>("#transit-stop-input");
        if (!this.inputElement) {
            console.warn("TransitWidget: Input element not found in the container.");
        }

        this.datalistElement = this.content.querySelector<HTMLDataListElement>("#transit-stops-datalist");
        if (!this.datalistElement) {
            console.warn("TransitWidget: Datalist element not found in the container.");
        }

    }


    /**
     * Method to attach a handler for when a choice is made from the datalist
     * @param handler Function to call when a choice is made, receives the selected stop ID
     * @returns void
     */
    public addChoiceSelectionHandler(handler: (selectedStopId: string) => void): void {
        const inputElement = this.inputElement;
        if (!inputElement) {
            console.warn("TransitWidget: Input element not found in the container.");
            return;
        }

        // When user makes a choice from the datalist
        // Pass the id of the selected stop to the handler
        inputElement.addEventListener("change", () => {
            // UGLY SOLUTION, FIX IN THE FUTURE
            const stopName = inputElement.value;
            const optionElement = this.datalistElement?.querySelector<HTMLOptionElement>(`option[value="${stopName}"]`);
            if (!optionElement) {
                console.warn("TransitWidget: No option element found for selected stop name ", stopName);
                return;
            }
            const id = optionElement.getAttribute("data-stop-id");
            if (!id) {
                console.warn("TransitWidget: No stop ID found for selected stop name ", stopName);
                return;
            }
            handler(id);
        });
    }

    public updateSchedule(scheduleData: ScheduleResponse): void {
        if (!this.listContainer) {
            console.warn("TransitWidget: List container element not found in the container.");
            return;
        }

        // Loop over the list items and update them with schedule data
        console.log(this.listItems);
        this.listItems.forEach((item, index) => {
            const scheduleEntry = scheduleData.schedules[index];
            if (!scheduleEntry) {
                item.textContent = "No data";
                return;
            }
            const realtimeDepartureElem = item.querySelector<HTMLElement>(".realtime-departure-time");
            const scheduledDepartureElem = item.querySelector<HTMLElement>(".scheduled-departure-time");
            const headsignElem = item.querySelector<HTMLElement>(".headsign");

            if (headsignElem) {
                headsignElem.textContent = scheduleEntry.headsign || "Unknown destination";
            }

            // departure time and serviceday are in seconds since epoch
            if (scheduledDepartureElem) {
                const formattedTime = this.formatScheduleTime(scheduleEntry.scheduledDeparture, scheduleEntry.serviceDay);
                scheduledDepartureElem.textContent = `Scheduled departure: ${formattedTime}`;
            }

            if (realtimeDepartureElem) {
                const formattedTime = this.formatScheduleTime(scheduleEntry.realtimeDeparture, scheduleEntry.serviceDay);
                realtimeDepartureElem.textContent = `Real-time departure: ${formattedTime}`;
            }
        });
    }

    public addTextInputHandler(handler: (input: string) => void): void {
        // Assign this to a local variable
        // because otherwise TypeScript complains about
        // 'this' possibly being null in the event listener
        // because it runs possibly later when this.inputElement
        // might have changed to null.
        const inputElement = this.inputElement;
        if (!inputElement) {
            console.warn("TransitWidget: Input element not found in the container.");
            return;
        }

        inputElement.addEventListener("input", () => {
            console.log("TransitWidget: Input changed to ", inputElement.value);
            handler(inputElement.value);
        });
    }

    /**
     * Formats a schedule time given timestamp and service day in seconds.
     * Essentially combines the two and converts to HH:MM format.
     * @param timestampSeconds timestamp in seconds since epoch
     * @param serviceDaySeconds service day in seconds since epoch (midnight of the service day)
     * @returns A string in HH:MM format
     */
    private formatScheduleTime(timestampSeconds: number | undefined, serviceDaySeconds: number | undefined): string {
        if (timestampSeconds === undefined || serviceDaySeconds === undefined) {
            return "N/A";
        }
        const totalSeconds = timestampSeconds + serviceDaySeconds;
        const date = new Date(totalSeconds * 1000);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    }

    public updateStops(stops: StopList): void {
    const stopList = this.datalistElement;
    if (!stopList) {
        console.warn("TransitWidget: Datalist element not found in the container.");
        return;
    }

    // Update datalist using map
    stopList.innerHTML = stops
        .map(stop => `<option value="${stop.name}" data-stop-id="${stop.gtfsId}">`)
        .join("");

}

}

export { TransitWidget };