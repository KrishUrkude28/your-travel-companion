/**
 * Weather Predictor Utility
 * Fetches geolocation and weather data from Open-Meteo
 */

export interface WeatherData {
  temp: number;
  desc: string;
}

export const getWeatherSuggestions = (temp: number): string => {
  if (temp < 15) return "Pack warm clothes! 🧥";
  if (temp > 28) return "Pack light! ☀️";
  return "Pack comfortable layers! 👕";
};

export const fetchDestinationWeather = async (destination: string): Promise<WeatherData | null> => {
  try {
    const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(destination)}&count=1&language=en&format=json`);
    const geoData = await geoRes.json();
    
    if (geoData.results && geoData.results[0]) {
      const { latitude, longitude } = geoData.results[0];
      const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`);
      const weatherData = await weatherRes.json();
      
      if (weatherData.current_weather) {
        const temp = Math.round(weatherData.current_weather.temperature);
        return {
          temp,
          desc: getWeatherSuggestions(temp)
        };
      }
    }
    return null;
  } catch (error) {
    console.warn("Weather predictor failed", error);
    return null;
  }
};
