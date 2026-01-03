import type {Result} from "../types.js"
class SafeJSON {
    
    /**
     * Safely parses a JSON string into an object
     * @param jsonString String containing JSON data
     * @returns Result object containing parsed data or error message
     */
    static parse(jsonString: string): Result<unknown> {
    try {
        const parsed = JSON.parse(jsonString);
        return { error: null, data: parsed };
    } catch (e) {
        if (e instanceof SyntaxError) {
            return { error: e.message, data: null };
        }
        // This should never happen
        return { error: "Unexpected error during JSON parsing", data: null };
    }
}
}

export { SafeJSON };