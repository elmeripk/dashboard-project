import { z } from "zod";

const APIWeatherResponse = z.object({
    temp: z.number().optional(),
    feels_like: z.number().optional(),
    sunrise: z.number().optional(),
    sunset: z.number().optional(),
    icon: z.string().optional(),
    description: z.string().optional(),
    wind_speed: z.number().optional(),
    name: z.string().optional(),
});

const APINameDayResponse = z.object({
    finnish: z.array(z.string()).default([]),
    swedish: z.array(z.string()).default([]),
    date: z.string()
})

const APITransitStop = z.object({
    gtfsId: z.string(),
    name: z.string(),
    id: z.string(),
});

const APITransitScheduleEntry = z.object({
    scheduledDeparture: z.number().optional(),
    realtimeDeparture: z.number().optional(),
    headsign: z.string().optional(),
    departureDelay: z.number().optional(),
    serviceDay: z.number().optional(),
});

const APITransitScheduleResponse = z.object({
    name: z.string(),
    schedules: z.array(APITransitScheduleEntry)
});


const APITransitStopResponse = z.array(APITransitStop);

export {APIWeatherResponse, APINameDayResponse, APITransitStop, APITransitStopResponse, APITransitScheduleEntry, APITransitScheduleResponse};