export interface WeatherResponse {
  icon: string;         
  temp: number;         
  feels_like: number;   
  sunrise: number;      
  sunset: number;       
  name: string;         
  wind_speed: number;   
}

export type UserLocation = {
    lat: number;
    lon: number;
    timestamp: number;
}