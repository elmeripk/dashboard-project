
import { ToastContainer } from './toastContainer';

class ToastManager {
    private static instance: ToastManager;
    private widget: ToastContainer;
    private constructor(widget: ToastContainer) {
        this.widget = widget;
    }

    // Copied from:
    // https://stackoverflow.com/questions/1050991/singleton-with-arguments-in-java
    static initialize(widget: ToastContainer): ToastManager {
        if (!ToastManager.instance) {
            console.log("Initializing ToastManager");
            ToastManager.instance = new ToastManager(widget);
        }
        return ToastManager.instance;
    }

    static getInstance(): ToastManager {
        if (!ToastManager.instance) {
            throw new Error('ToastManager not initialized. Call initialize() first.');
        }
        return ToastManager.instance;
    }

    warning(message: string, duration = 3000) {
        console.warn(`Warning: ${message}`);
        this.widget.addToast('warning', message, duration);
    }

    error(message: string, duration = 3000) {
        this.widget.addToast('error', message, duration);
    }
}

export { ToastManager };