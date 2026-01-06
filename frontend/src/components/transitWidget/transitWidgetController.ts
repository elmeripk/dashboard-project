import { TransitWidget } from "./transitWidget";
import { ToastManager } from "../toastWidget/toastManager";
import { debounce } from "../../utils/debounce";
import type { Result } from "../../../../shared/src/types";
import { ValidatingFetcher } from "../../../../shared/src/utils/ValidatingFetcher";
import { APITransitStopResponse, APITransitScheduleEntry, APITransitScheduleResponse } from "../../../../shared/src/schemas";

import z from "zod";

type StopList = z.infer<typeof APITransitStopResponse>;
type ScheduleEntry = z.infer<typeof APITransitScheduleEntry>;
type ScheduleResponse = z.infer<typeof APITransitScheduleResponse>;
class TransitWidgetController {

    private view: TransitWidget;

    constructor(view: TransitWidget) {
        this.view = view;
        const debouncedHandleInput = debounce((input: string) => this.handleTransitStopInput(input), 300);
        this.view.addTextInputHandler(debouncedHandleInput);
        this.view.addChoiceSelectionHandler((selectedStopId: string) => this.handleStopSelection(selectedStopId));
    }

    private async handleStopSelection(selectedStopId: string): Promise<void> {
        const result = await this.fetchTransitSchedule(selectedStopId);

        if (result.error || !result.data) {
            console.error("TransitWidgetController: Error fetching transit schedule: ", result.error);
            ToastManager.getInstance().error("Error fetching transit schedule data.", 3000);
            return;
        }

        this.view.updateSchedule(result.data);

    }

    private async handleTransitStopInput(input: string): Promise<void> {
  
        const result = await this.fetchTransitStops(input);
   
        if (result.error || !result.data) {
            console.error("TransitWidgetController: Error fetching transit stops: ", result.error);
            ToastManager.getInstance().error("Error fetching transit stops data.", 3000);
            return;
        }

        this.view.updateStops(result.data);
    }

    private async fetchTransitStops(input: string): Promise<Result<StopList>> {
        const url = new URL('/api/v1/transit/stops', window.location.origin);
        url.searchParams.append('pattern', input);

        const result = await ValidatingFetcher.fetchAndValidateData<StopList>(url.toString(), APITransitStopResponse);
        return result;
    }

    private async fetchTransitSchedule(stopId: string): Promise<Result<ScheduleResponse>> {
        const url = new URL('/api/v1/transit/schedule', window.location.origin);
        url.searchParams.append('stopId', stopId);

        const result = await ValidatingFetcher.fetchAndValidateData(url.toString(), APITransitScheduleResponse);
        return result;
    }
        

}

export {TransitWidgetController};