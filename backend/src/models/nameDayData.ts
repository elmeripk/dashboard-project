import type { Request, Response } from "express";
import { ValidatingFetcher } from "../../../shared/src/utils/ValidatingFetcher.js";
import { sendError, sendSuccess } from "./utils/fetchUtils.js";
import type {ParsedQs} from 'qs';
import type { Result } from "../../../shared/src/types.js";
import { APINameDayResponse } from "../../../shared/src/schemas.js";
import * as cheerio from "cheerio";
import type z from "zod";

const BASE_URL = "https://www.nimipaivat.fi/"

type DayDotMonth = `${number}.${number}.`;

type ParsedDate = {
  originalAsString: string;
  dayDotMonth: DayDotMonth;
};


type NameDayResult = {
    swedishNames: string[];
    finnishNames: string[];
}

const DAYS_IN_MONTH = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];


// How to match word exactly: 
// https://stackoverflow.com/questions/3479324/regular-expression-to-match-string-exactly
const DATE_PATTERN = /^(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/

async function getNameDays(req: Request, res: Response){

    const date = req.query.date;

    const result = formatDateParam(date);
    
    if (result.error || result.data == null) {
        sendError(result.error, res, 404);
        return;
    }
    const HTMLStructure = await getNameDayPage(result.data.dayDotMonth);
    if(HTMLStructure.error || HTMLStructure.data == null){
        sendError(HTMLStructure.error, res, 500);
        return;
    }

    const nameDayResult = getNameDaysFromPage(HTMLStructure.data);

    const responseData: z.infer<typeof APINameDayResponse> = {
        finnish: nameDayResult.finnishNames,
        swedish: nameDayResult.swedishNames,
        date: result.data.originalAsString // Because of formatDateParam, date is always a valid string here
    };
    console.log("NameDayData: Sending response", responseData);
    sendSuccess(responseData, res);
    
}

async function getNameDayPage(date: DayDotMonth): Promise<Result<string>>{
  
    const fullURl = new URL(date, BASE_URL);

    const result = await ValidatingFetcher.fetchHTML(fullURl);
    if(result.error){
        return {error: result.error, data: null};
    }

    // No error to forward, but data is null
    if(result.data == null){
        return {error: "No data received from the name day page", data: result.data};
    }
    
    return {data: result.data, error: null};

}


/**
 * Formats a user supplied query string into format DAY.MONTH. if possible
 * @param param The query string to parse
 * @return Result object containing error or formatted date string
 */
function formatDateParam(
    param: string | ParsedQs | (string | ParsedQs)[] | undefined): Result<ParsedDate> {

    if (!param) {
        return { error: "Date must be supplied to the API as a query string MM-DD", data: null };
    }

    const dateAsPlainString = param.toString();

    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/match
    const match = dateAsPlainString.match(DATE_PATTERN);

    if (!match) {
        return { error: "The provided date format is not correct. It should be MM-DD", data: null };
    }

    // Month and day are in capturing groups 1 and 2
    const [_, month, day] = match;

    

    // This is always successful because regex matches only numbers
    // so assertion is safe here
    const monthInt = parseInt(month!); // Removes leading zeroes
    const dayInt = parseInt(day!);

    // Because of regex, month is always 1-12 here
    // so it can't go out of bounds of the array
    // Thus assertion is safe here
    if (dayInt > DAYS_IN_MONTH[monthInt - 1]!) {
        return { error: "The provided date is not valid", data: null };
    }

    if (monthInt === 2 && dayInt === 29) {
        return { error: "No namedays on February 29", data: null };
    }

    const parseDate: ParsedDate = {
        originalAsString: dateAsPlainString,
        dayDotMonth: `${dayInt}.${monthInt}.` as DayDotMonth
    };


    return {
        data: parseDate,
        error: null
    };
}

/**
 * Extracts name day data from the provided HTML string
 * @param HTML The HTML string to parse
 * @returns NameDayResult object containing Finnish and Swedish names. Fields contain empty arrays if no names found.
 */
function getNameDaysFromPage(HTML: string): NameDayResult{

    // https://stackoverflow.com/questions/34709765/cheerio-how-to-select-element-by-text-content
    // https://cheerio.js.org/docs/basics/selecting
    const $= cheerio.load(HTML);
    const $finnishNamesElem = $("p:contains('Nimipäivää viettävät:')");
    const $swedishNamesElem = $("p:contains('Epävirallista nimipäivää viettävät:')");

    // The strong elements contain the names and are children of the p
    // If there are no elements, the length of the element array is 0

    // Get function explained:
    // https://stackoverflow.com/questions/54164509/what-does-the-get-function-do-in-cheerio
    const finnishNames = $finnishNamesElem.find("strong")
                        .map((_, elem) => $(elem).text())
                        .get();
    
    const swedishNames = $swedishNamesElem.find("strong")
                        .map((_, elem) => $(elem).text())
                        .get();

    return {finnishNames: finnishNames, swedishNames: swedishNames};
    

}

export {getNameDays}