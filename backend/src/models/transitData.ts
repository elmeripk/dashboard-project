const NYSSE_KEY = process.env.NYSSE_API_KEY || ""
import type { Request, Response } from 'express';
import { Result} from '@dashboard/shared';
import { ValidatingFetcher } from '@dashboard/shared';
import { transitStopListSchema, originalStopsData } from './transitDataSchemas.js';
import { APITransitStopResponse } from '@dashboard/shared';
const BASE_URL = "https://api.digitransit.fi"
const ROUTE_API_VERSION = "v2"
const SUB_API_VERSION = "v1"
const WALTTI_REGION_URL = `/routing/${ROUTE_API_VERSION}/waltti/gtfs/${SUB_API_VERSION}`
const TRANSIT_API_URL = new URL(WALTTI_REGION_URL, BASE_URL);
TRANSIT_API_URL.searchParams.append("digitransit-subscription-key", NYSSE_KEY);
import * as z from "zod";
const MS_IN_24_HOURS = 24 * 60 * 60 * 1000;

type FrontendTransitStopList = z.infer<typeof APITransitStopResponse>;
type StopsData = z.infer<typeof transitStopListSchema>;

/** In-memory cache for transit data */
class TransitCache {
    private stopsData: StopsData | null = null
    private treStopsData: StopsData | null = null
    private lastRefreshTime: number = 0

    public getStopsData(): StopsData | null {
        return this.stopsData;
    }

    public setStopsData(data: StopsData): void {
        this.stopsData = data;
        this.lastRefreshTime = Date.now();
    }

    public getTreStopsData(): StopsData | null {
        return this.treStopsData;
    }

    public setTreStopsData(data: StopsData): void {
        this.treStopsData = data;
    }

    public isStale(): boolean {
        return Date.now() - this.lastRefreshTime > MS_IN_24_HOURS;
    }
}

const transitCache = new TransitCache();

/**
 * Get a list of stops in Tampere region
 * @param req The request object
 * @param res The response object
 * @returns 
 */
async function getStopsTre(req: Request, res: Response): Promise<void> {
    const result = await getTreStopsData();
    if (result.error || !result.data) {
        res.status(500).send(`Error fetching Tampere stops data: ${result.error}`);
        return;
    }
    res.status(200).json(result.data);
}

async function getAllStops(req: Request, res: Response): Promise<void> {
    const result = await getAllStopsData();
    if (result.error || !result.data) {
        res.status(500).send(`Error fetching stops data: ${result.error}`);
        return;
    }
    res.status(200).json(result.data);
}

async function getStopsMatchingPattern(req: Request, res: Response): Promise<void> {
    const pattern = req.query.pattern ? req.query.pattern.toString() : "";
    const result = await getStopsMatchingPatternData(pattern);

    if (result.error || !result.data) {
        res.status(500).send(`Error fetching stops data: ${result.error}`);
        return;
    }

    res.status(200).json(result.data);
}

// TODO: MAKE ENDPOINTS FOR TAMPERE AND ALL STOPS
// AND MAKE IT SUPPORT QUERY PARAMETER FOR FILTERING STOPS BY NAME

/**
 * Get (for now) Tampere stops matching the given pattern
 * @param pattern String pattern to match stop names against
 * @returns A list of stops whose names match the pattern
 */
async function getStopsMatchingPatternData(pattern: string): Promise<Result<FrontendTransitStopList>> {
    const allStopsResult = await getTreStopsData();
    if (allStopsResult.error || !allStopsResult.data) {
        return {error: allStopsResult.error, data: null};
    }

    // If pattern is empty, return all stops
    if (pattern.trim() === "") {
        return {data: allStopsResult.data, error: null};
    }

    const patternLower = pattern.toLowerCase();
    const matchingStops = allStopsResult.data.filter(stop => 
        stop.name.toLowerCase().startsWith(patternLower)
    );

    // Pick name, id, gtfsId only for frontend
    // Because validation has been done, all the fields must exist
    const frontendStops: FrontendTransitStopList = matchingStops.map(stop => ({
        name: stop.name,
        id: stop.id,
        gtfsId: stop.gtfsId
    }));

    return {data: frontendStops, error: null};
}


async function getTreStopsData(): Promise<Result<StopsData>> {
    const cachedData = transitCache.getTreStopsData();
    
    if (cachedData && !transitCache.isStale()) {
        console.log("TransitData: Returning cached Tampere stops data");
        return {data: cachedData, error: null};
    }

    // Otherwise, fetch all stops and filter for Tampere
    const result = await getAllStopsData();
    if (result.error || !result.data) {
        return {error: result.error, data: null};
    }
    
    const tampereStops = filterStopsForTampere(result.data);
    transitCache.setTreStopsData(tampereStops);
    return {data: tampereStops, error: null};
}

async function getAllStopsData(): Promise<Result<StopsData>> {
    const cachedData = transitCache.getStopsData();
    
    if (cachedData && !transitCache.isStale()) {
        console.log("TransitData: Returning cached stops data");
        return {data: cachedData, error: null};
    }else{
        console.log("TransitData: Cached stops data is stale or not present, fetching new data");
    }

    const query = `
    query {
        stops {
            gtfsId
            name
            lat
            lon,
            code,
            id
        }
    }`;
    const body = {query: query};

    const result = await ValidatingFetcher.fetchAndValidateData(TRANSIT_API_URL, originalStopsData, {}, "POST", body);
    if (result.error || !result.data) {
        return {error: result.error || "No data", data: null};
    }
    
    const stopsArray = result.data.data.stops;
    const validatedData = transitStopListSchema.safeParse(stopsArray);
    if (!validatedData.success) {
        return {error: "Validation failed", data: null};
    }
    transitCache.setStopsData(validatedData.data);
    return {data: validatedData.data, error: null};
}

/**
 * Returns only stops in Tampere from the given list
 * @param stops  The list of all transit stops
 * @returns A filtered list containing only Tampere stops
 */
function filterStopsForTampere(stops: StopsData): StopsData {
    return stops.filter(stop => stop.gtfsId.toLowerCase().includes("tampere"));
}

export { getStopsTre, getAllStops, getStopsMatchingPattern };