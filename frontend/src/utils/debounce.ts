
/**
 * A debounce function that delays the execution of the callback
 * @param callback Callback function to debounce
 * @param wait Number of milliseconds to wait before invoking the callback
 * @returns A debounced version of the callback function
 * @see https://www.joshwcomeau.com/snippets/javascript/debounce/
 */
function debounce(callback: (...args: any[]) => void, wait: number): (...args: any[]) => void {

    // This stays in scope because of closure
    // (it has function referencing it)
    let timeoutId: number | undefined = undefined;

    return (...args: any[]): void => {
        
        clearTimeout(timeoutId);
        
        timeoutId = window.setTimeout(() => {
            callback(...args);
        }, wait);
    };
}

export {debounce};