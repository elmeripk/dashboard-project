import { TransitWidget } from "./transitWidget";
import { ToastManager } from "../toastWidget/toastManager";
import { debounce } from "../../utils/debounce";
import type { Result } from "../../../../shared/src/types";
import { ValidatingFetcher } from "../../../../shared/src/utils/ValidatingFetcher";
import { APITransitStopResponse } from "../../../../shared/src/schemas";
import type z from "zod";

type StopList = z.infer<typeof APITransitStopResponse>;

class TransitWidgetController {

    private view: TransitWidget;

    constructor(view: TransitWidget) {
        this.view = view;
        const debouncedHandleInput = debounce((input: string) => this.handleTransitStopInput(input), 300);
        this.view.addTextInputHandler(debouncedHandleInput);
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

}

export {TransitWidgetController};