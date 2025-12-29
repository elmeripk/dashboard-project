import * as z from 'zod';
import {APIWeatherResponse} from '../../../shared/weatherSchemas';

export const CurrentWeather = z.object({
  main: z.object({
    temp: z.number(),
    feels_like: z.number(),
  }),
  sys: z.object({
    sunrise: z.number(),
    sunset: z.number(),
  }),
  weather: z.array(
    z.object({
      icon: z.string(),
      description: z.string(),
    })
  ),
  wind: z.object({
    speed: z.number(),
  }),
  name: z.string(),
}).transform((data) =>
  // Pipe the original API response into the simplified schema
  APIWeatherResponse.parse({
    temp: Math.round(data.main.temp),
    feels_like: Math.round(data.main.feels_like),
    sunrise: data.sys.sunrise,
    sunset: data.sys.sunset,
    icon: data.weather[0].icon,
    description: data.weather[0].description,
    wind_speed: Math.round(data.wind.speed),
    name: data.name
  })
);
