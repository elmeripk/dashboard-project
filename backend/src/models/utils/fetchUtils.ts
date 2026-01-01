import type {Request, Response} from 'express';

export type fetchError = {
    error: string
    status: number
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

export {sendSuccess, sendError};