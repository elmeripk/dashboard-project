import type {Request, Response} from 'express';

export type fetchError = {
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
        return data;
    } catch (e) {
        const err: fetchError = { error: errorMsg, status: errorCode };
        return err;
    }
}

function sendResponse( data: Record<string, any>, res: Response, statusCode: number = 200, contentType: string = 'application/json'){
    res.writeHead(statusCode, { 'Content-Type': contentType });
    res.write(JSON.stringify(data));
    res.end();
}

function sendSuccess( data: Record<string, any>, res: Response, statusCode: number = 200, contentType = 'application/json'){
    sendResponse(data, res, statusCode, contentType);
}

function sendError(errorMsg: string, res: Response, statusCode: number = 500, contentType = 'application/json'){
    const errorResponse = { error: errorMsg};
    sendResponse(errorResponse, res, statusCode, contentType);
}

export {APIFetch, sendSuccess, sendError};