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
})

export {APIWeatherResponse, APINameDayResponse};