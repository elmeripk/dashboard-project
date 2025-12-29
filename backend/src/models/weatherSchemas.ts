import * as z from 'zod';

export const CurrentWeather = z.object({
    main: z.object({
        temp: z.number(),
        feels_like: z.number()
    }),
    sys: z.object({
        sunrise: z.number(),
        sunset: z.number()
    }),
    weather: z.array(z.object({
        icon: z.string(),
        description: z.string()
    })),
    wind: z.object({
        speed: z.number()
    })
}).transform((data) => ({
    temp: data.main.temp,
    feels_like: data.main.feels_like,
    sunrise: data.sys.sunrise,
    sunset: data.sys.sunset,
    icon: data.weather[0].icon,
    description: data.weather[0].description,
    wind_speed: data.wind.speed
}));

export const WeatherIcon = z.object({
    icon: z.string()
});