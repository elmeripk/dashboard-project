import {z} from 'zod';
import { APITransitScheduleEntry } from '@dashboard/shared';

const transitStopSchema = z.object({
    gtfsId: z.string(),
    name: z.string(),
    code: z.string().nullable().default(""),
    lat: z.number().optional(),
    lon: z.number().optional(),
    id: z.string(),
});

const originalStopsData = z.object({
    data: z.object({
        stops: z.array(transitStopSchema)
    })
});

const originalTransitScheduleData = z.object({
    data: z.object({
        stop: z.object({
            name: z.string(),
            stoptimesWithoutPatterns: z.array(APITransitScheduleEntry)
        })
    })
});

const transitStopListSchema = z.array(transitStopSchema);

export {transitStopSchema, originalStopsData, transitStopListSchema, originalTransitScheduleData};