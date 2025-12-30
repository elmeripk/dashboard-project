/**
 * An utility function to update the text content of a DOM element.
 * @param selector Selector string to find the target element. Passed to querySelector.
 * @param text Text content to set on the found element.
 * @param parentSelector An optional parent element or document to scope the query. Defaults to document.
 * @returns True if success, false otherwise
 * @throws None
 */
function updateTextContent(selector: string, text: string, parentSelector: HTMLElement | Document = document): boolean {
    
    const element = parentSelector.querySelector<HTMLElement>(selector);
    if (element) {
        element.textContent = text;
        return true;
    }
    return false;
}

/**
 * An utility function to update an attribute of a DOM element.
 * @param selector A selector string to find the target element. Passed to querySelector.
 * @param attribute The attribute to set
 * @param value The value to set on the attribute
 * @param parentSelector An optional parent element or document to scope the query. Defaults to document.
 * @returns True if success, false otherwise
 * @throws None
 */
function updateElementAttribute(selector: string, attribute: string, value: string, parentSelector: HTMLElement | Document = document): boolean {
    const element = parentSelector.querySelector<HTMLElement>(selector);
    if (element) {
        element.setAttribute(attribute, value);
        return true;
    }
    return false;
}

export { updateTextContent, updateElementAttribute };
