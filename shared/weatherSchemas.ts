import { z } from "zod";

export const APIWeatherResponse = z.object({
    temp: z.number().optional(),
    feels_like: z.number().optional(),
    sunrise: z.number().optional(),
    sunset: z.number().optional(),
    icon: z.string().optional(),
    description: z.string().optional(),
    wind_speed: z.number().optional(),
    name: z.string().optional(),
});