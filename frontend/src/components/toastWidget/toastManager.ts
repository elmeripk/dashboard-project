
import { ToastContainer } from './toastContainer';

/**
 * Singleton manager for displaying toast notifications.
 */
class ToastManager {
    private static instance: ToastManager;
    private widget: ToastContainer;
    private constructor(widget: ToastContainer) {
        this.widget = widget;
    }

    /**
     * Initializes the ToastManager singleton with a ToastContainer instance.
     * @note This method must be called before getInstance(). As it is the only way to pass
     * the ToastContainer dependency to the singleton.
     * @param widget The ToastContainer instance to manage
     * @see https://stackoverflow.com/questions/1050991/singleton-with-arguments-in-java
     * @returns The singleton instance of ToastManager
     */
    static initialize(widget: ToastContainer): ToastManager {
        if (!ToastManager.instance) {
            ToastManager.instance = new ToastManager(widget);
        }
        return ToastManager.instance;
    }

    /**
     * Retrieve a shared instance of the ToastManager
     * @returns 
     */
    static getInstance(): ToastManager {
        if (!ToastManager.instance) {
            throw new Error('ToastManager not initialized. Call initialize() first.');
        }
        return ToastManager.instance;
    }

    /**
     * Creates and displays a warning toast notification.
     * @param message The warning message to display
     * @param duration Duration in milliseconds for which the toast is visible
     */
    warning(message: string, duration = 3000) {
        console.warn(`Warning: ${message}`);
        this.widget.addToast('warning', message, duration);
    }

    /**
     * Creates and displays an error toast notification.
     * @param message The error message to display
     * @param duration Duration in milliseconds for which the toast is visible
     */
    error(message: string, duration = 3000) {
        this.widget.addToast('error', message, duration);
    }
}

export { ToastManager };