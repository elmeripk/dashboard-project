export abstract class Loadable {

    private loadingElement: HTMLElement;
    private contentElement: HTMLElement;

    /**
     * 
     * @param container The container element housing the loading and content elements
     * @param loadingElement Either a selector string or the loading HTMLElement itself. String selector is passed to container.querySelector
     * @param contentElement Either a selector string or the content HTMLElement itself. String selector is passed to container.querySelector
     * @throws Error if loadingElement or contentElement are not found in the container
     */
    constructor(container: HTMLElement, 
        loadingElement: string | HTMLElement = ".loading", 
        contentElement: string | HTMLElement = ".content") {
        
            const loadingElem= typeof loadingElement === "string" ? 
            container.querySelector<HTMLElement>(loadingElement) 
            : loadingElement;
        
        const contentElem =  typeof contentElement === "string" ?
            container.querySelector<HTMLElement>(contentElement) 
            : contentElement;
        
        if (!loadingElem || !contentElem) {
            throw new Error("Loadable: Loading or content element not found in the container.");
        }
        this.loadingElement = loadingElem;
        this.contentElement = contentElem;
    }

    /**
     * Displays or hides the loading element and content element based on the loading state.
     * @param loading Whether to show the loading element (true) or the content element (false)
     * @returns True if the elements were successfully updated, false if the elements were not found
     */
    public setLoading(loading: boolean): boolean {
        
        
        if (loading) {
            this.loadingElement.style.display = 'block';
            this.contentElement.style.display = 'none';
        } else {
            this.loadingElement.style.display = 'none';
            this.contentElement.style.display = 'block';
        }
        return true;
    }
}