import { TransitWidget } from "./transitWidget";
import { ToastManager } from "../toastWidget/toastManager";
import { debounce } from "../../utils/debounce";
import type { Result } from "../../../../shared/src/types";
import { ValidatingFetcher } from "../../../../shared/src/utils/ValidatingFetcher";

class TransitWidgetController {

    private view: TransitWidget;

    constructor(view: TransitWidget) {
        this.view = view;
        const debouncedHandleInput = debounce((input: string) => this.handleTransitStopInput(input), 300);
        this.view.addTextInputHandler(debouncedHandleInput);
    }

    private handleTransitStopInput(input: string): void {
        ToastManager.getInstance().warning("TransitWidgetController: Stop input changed to: " + input);
    }


}

export {TransitWidgetController};