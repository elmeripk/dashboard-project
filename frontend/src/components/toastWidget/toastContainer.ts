
import type { Result } from "../../../../shared/src/types";
import warningIcon from "../../../assets/warning-icon.svg";
import errorIcon from "../../../assets/error-icon.svg"
import "./toastContainer.css";
type IconType = 'warning' | 'error';

class ToastContainer {
    private container: HTMLElement;
    private template: HTMLTemplateElement;

    // A bit like final in Java
    private readonly icons: Record<IconType, string> = {
        warning: warningIcon,
        error: errorIcon,
    };

    constructor(container: HTMLElement, template: HTMLTemplateElement) {
        this.container = container;
        this.template = template;
    }

    /**
     * Adds a toast notification to a the container
     * @param type Type of the toast (warning or error)
     * @param message Message to display in the toast
     * @param duration Duration in milliseconds for which the toast is visible
     */
    addToast(type: IconType, message: string, duration = 3000) {
        const result = this.createToastElement(type, message);

        if (result.error || !result.data) {
            console.error(`ToastContainer: Failed to create toast element: ${result.error}`);
            return;
        }

        const element = result.data;

        this.container.appendChild(element);
        
        // This was created with the help of Claude
        const timeoutId = setTimeout(() => {
            element.classList.add("toast-hide");
            element.addEventListener('transitionend', () => {
                element.remove();
            }, { once: true });
        }, duration);

        // Manual close, this could be handled by the controller
        // but as it is purely presentational, it makes sense to keep it here and not
        // delegate to controller. Not sure if alings with MVP.
        const closeBtn = element.querySelector('.toast-close-button');
        if (!closeBtn) {
            console.warn('ToastContainer: Toast template is missing .toast-close-button element.');
            return;
        }

        closeBtn?.addEventListener('click', () => {
            clearTimeout(timeoutId);
            element.classList.add("toast-hide");
            element.addEventListener('transitionend', () => element.remove(), { once: true });
        });
    }

    /**
     * Creates a toast DOM element from the template
     * @param type Type of the toast (warning or error)
     * @param message Message to display in the toast
     * @returns Wrapper object containing either the created HTMLElement or an error message
     */
    private createToastElement(type: IconType, message: string): Result<HTMLElement> {

        // This is assured to be valid because the the template is provided
        // through dependency injection and caller must make the checks.
        const clone = this.template.content.cloneNode(true) as DocumentFragment;
        const element = clone.querySelector<HTMLElement>('.toast');
        if (!element) {
            console.error('ToastContainer: Toast template is missing .toast element.');
            return { error: 'Toast template is missing .toast element.', data: null };
        }

        element.className = `toast toast-${type}`;

        const iconElem = element.querySelector<HTMLImageElement>('.toast-icon');
        
        if (iconElem) {
            const iconSrc = this.icons[type];
            iconElem.src = iconSrc;
            iconElem.alt = `${type} icon`;
        } else {
            console.warn('ToastContainer: Toast template is missing .toast-icon element.');
        }
        
        const messageElem = element.querySelector<HTMLParagraphElement>('.toast-message');
        if (messageElem) {
            messageElem.textContent = message;
        }else{
            console.warn('ToastContainer: Toast template is missing .toast-message element.');
        }
        
        return { error: null, data: element };
    }
}

export { ToastContainer };