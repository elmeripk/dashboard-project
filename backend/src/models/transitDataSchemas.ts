import {z} from 'zod';

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

const transitStopListSchema = z.array(transitStopSchema);

export {transitStopSchema, originalStopsData, transitStopListSchema};