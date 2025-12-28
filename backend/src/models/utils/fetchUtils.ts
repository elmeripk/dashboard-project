type fetchError = {
    error: string
    status: number
}

/**
 * Utility fetch wrapper that makes a GET request to endpoint
 * and returns the response or 
 * @param url URL to make a request to
 * @param errorMsg Error message to use in the returned error
 * @param errorCode Error code to use in the returned error
 * @returns Response body on successful request or error object on failure
 */
async function APIFetch(url: URL, errorMsg: string, errorCode: number = 502): Promise<Record<string, any> | fetchError>{
    try {
        const response = await fetch(url);

        if (!response.ok) {
            const err: fetchError = { error: errorMsg, status: errorCode };
            return err;
        }

        const data = await response.json();
        return { data };
    } catch (e) {
        const err: fetchError = { error: errorMsg, status: errorCode };
        return err;
    }
}

export {APIFetch};