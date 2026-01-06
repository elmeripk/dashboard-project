import "./transitWidget.css"
class TransitWidget {
    private content: HTMLElement;
    private listContainer: HTMLUListElement | null = null;
    private listItems: HTMLLIElement[] = [];
    private inputElement: HTMLInputElement | null = null;
    private datalistElement: HTMLDataListElement | null = null;
    private inputIsFocused: boolean = false;

    constructor(container: HTMLElement) {
        this.content = container;
        this.cacheElements();
    }


    /**
     * Cache elements used in the widget
     */
    private cacheElements(): void {
        const listContainer = this.content.querySelector<HTMLUListElement>("#transit-stops-ul");
        if (!listContainer) {
            console.warn("TransitWidget: List container element not found in the container.");
        }else{
            this.listContainer = listContainer;
            this.listItems = Array.from(listContainer.querySelectorAll<HTMLLIElement>("li"));
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

    public updateStops(stops: { id: string; name: string }[]): void {
    const stopList = this.datalistElement;
    if (!stopList) {
        console.warn("TransitWidget: Datalist element not found in the container.");
        return;
    }

    // Update datalist using map
    stopList.innerHTML = stops
        .map(stop => `<option value="${stop.name}" data-stop-id="${stop.id}">`)
        .join("");

}

}

export { TransitWidget };