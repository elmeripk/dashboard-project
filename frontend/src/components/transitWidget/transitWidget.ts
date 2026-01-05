import { Loadable } from "../loadable/Loadable";

class TransitWidget extends Loadable {
    private content: HTMLElement;
    private listContainer: HTMLUListElement | null = null;
    private listItems: HTMLLIElement[] = [];

    constructor(container: HTMLDivElement, loadingElement: HTMLElement, contentElement: HTMLElement) {
       
        super(container, loadingElement, contentElement);
        this.content = contentElement;
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
    }
}