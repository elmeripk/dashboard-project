// ZodSchema has been deprecated in favor of ZodType
// https://github.com/colinhacks/zod/issues/4877
import {ZodType} from "zod";
import type {Result} from "../types";

// Declaring T here makes it available throughout the class
// as per ChatGPT suggestion
class ValidatingFetcher{

    /**
     * Validates the given data against the provided Zod schema
     * @param data  Data to be validated
     * @param schema Zod schema to validate against
     * @returns Result object containing either the validated data or an error message
     */
    private static validateResponse<T>(data: unknown, schema: ZodType<T>): Result<T> {
        const validated = schema.safeParse(data);
        if (!validated.success) {
            return { error: JSON.stringify(validated.error), data: null };
        }
        return { error: null, data: validated.data };
    }

    /**
     * Fetches data from the given URL with the provided parameters without validation
     * @param params  Object containing query parameters as key-value pairs
     * @param url URL endpoint to fetch data from, concatenated with base URL if applicable
     * @returns The fetched data as JSON or null on failure
     */
    static async fetchData(url: URL | string, params: Record<string, string> = {}): Promise<Result<unknown>> {

        const urlObj = typeof url === "string" ? new URL(url) : url;
   
        for (const key in params) {
            urlObj.searchParams.append(key, params[key]);
        }

        try {
            const response = await fetch(urlObj.toString());
            if (!response.ok) {
                return { error: `HTTP error! status: ${response.status}`, data: null };
            }
            const data = await response.json();
            return { error: null, data };

        } catch (error) {
            return { error: (error as Error).message, data: null };
        }
    }

    /**
     * Fetches data from the given URL with the provided parameters and validates it against the provided Zod schema
     * @param params Object containing query parameters as key-value pairs
     * @param url URL endpoint to fetch data from, concatenated with base URL if applicable
     * @param schema Zod schema to validate the fetched data against
     * @returns The validated data or null if validation fails
     */
    static async fetchAndValidateData<T extends NonNullable<unknown>>(url: URL | string, schema: ZodType<T>, params: Record<string, string> = {}): Promise<Result<T>> {

        const response = await ValidatingFetcher.fetchData(url, params);

        //Forward the HTTP or Fetch error if it happened
        if (response.error) {
            return { error: response.error, data: null };
        }
        const data = response.data;
        const validatedData = ValidatingFetcher.validateResponse(data, schema);
        if (validatedData.error) {
            return { error: "Validation failed", data: null };
        }
        if(validatedData.data == null){
            return { error: "Validated data is null", data: null };
        }
        return { error: null, data: validatedData.data };
    }

    static async fetchHTML(url: URL | string, params: Record<string, string> = {}): Promise<Result<string>> {

        const urlObj = typeof url === "string" ? new URL(url) : url;
   
        for (const key in params) {
            urlObj.searchParams.append(key, params[key]);
        }
        
        try {
            const response = await fetch(urlObj.toString());
            if (!response.ok) {
                return { error: `HTTP error! status: ${response.status}`, data: null };
            }
            const data = await response.text();
            return { error: null, data };
        } catch (error) {
            return { error: (error as Error).message, data: null };
        }
    }

}

export { ValidatingFetcher };