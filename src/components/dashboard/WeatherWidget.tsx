
import React, { useEffect, useState } from 'react';
import { Cloud, CloudDrizzle, CloudLightning, CloudRain, CloudSnow, Sun, CloudFog, Wind } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface WeatherData {
  temperature: number;
  condition: string;
  windSpeed: number;
  windDirection: string;
  humidity: number;
  visibility: string;
  location?: string;
  icon?: string;
}

interface WeatherWidgetProps {
  data?: WeatherData;
  city?: string;
}

const WeatherWidget: React.FC<WeatherWidgetProps> = ({ data: initialData, city = 'Saint Louis' }) => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(initialData || null);
  const [loading, setLoading] = useState<boolean>(!initialData);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Using OpenWeatherMap API - Replace with your own API key if you have one
        // For demo purposes, we're using a public API key - consider getting your own for production
        const apiKey = '8d2de98e089f1c28e1a22fc19a24ef04'; // This is a public demo key
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch weather data');
        }
        
        const data = await response.json();
        
        setWeatherData({
          temperature: Math.round(data.main.temp),
          condition: data.weather[0].main.toLowerCase(),
          windSpeed: Math.round(data.wind.speed),
          windDirection: getWindDirection(data.wind.deg),
          humidity: data.main.humidity,
          visibility: `${(data.visibility / 1000).toFixed(1)} km`,
          location: data.name,
          icon: data.weather[0].icon
        });
      } catch (err) {
        console.error('Error fetching weather data:', err);
        setError('Could not load weather data');
        // Fall back to initial data if provided
        if (initialData) {
          setWeatherData(initialData);
        }
      } finally {
        setLoading(false);
      }
    };

    // Only fetch if there's no initial data provided
    if (!initialData) {
      fetchWeatherData();
    }
  }, [city, initialData]);

  const getWindDirection = (degrees: number): string => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(degrees / 45) % 8;
    return directions[index];
  };

  const renderWeatherIcon = (condition: string, iconCode?: string) => {
    // For night time icons (ending with 'n')
    const isNight = iconCode?.endsWith('n');
    
    // Map API conditions to our icons
    switch (condition.toLowerCase()) {
      case 'clear':
        return <Sun className="h-10 w-10 text-yellow-500" />;
      case 'clouds':
        return <Cloud className="h-10 w-10 text-gray-500" />;
      case 'rain':
      case 'drizzle':
        return <CloudRain className="h-10 w-10 text-blue-500" />;
      case 'thunderstorm':
        return <CloudLightning className="h-10 w-10 text-purple-500" />;
      case 'snow':
        return <CloudSnow className="h-10 w-10 text-blue-300" />;
      case 'mist':
      case 'fog':
      case 'haze':
        return <CloudFog className="h-10 w-10 text-gray-400" />;
      case 'dust':
      case 'sand':
      case 'ash':
        return <Wind className="h-10 w-10 text-amber-500" />;
      default:
        return <Sun className="h-10 w-10 text-yellow-500" />;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Weather</CardTitle>
          <CardDescription>Loading weather data...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-8">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-10 w-10 bg-gray-200 rounded-full mb-4"></div>
            <div className="h-6 w-24 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 w-32 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !weatherData) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Weather</CardTitle>
          <CardDescription>Unable to load weather</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">{error || 'No weather data available'}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Current Weather</CardTitle>
        <CardDescription>{weatherData.location || 'Local airport conditions'}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-3xl font-bold">{weatherData.temperature}°C</span>
            <span className="text-sm text-gray-500">
              {weatherData.condition.charAt(0).toUpperCase() + weatherData.condition.slice(1)}
            </span>
          </div>
          <div className="p-3 rounded-full bg-gray-100">
            {renderWeatherIcon(weatherData.condition, weatherData.icon)}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-2">
        <div className="grid grid-cols-2 gap-2 w-full text-sm">
          <div className="flex items-center gap-2">
            <span className="text-gray-500">Wind:</span>
            <span>{weatherData.windSpeed} km/h {weatherData.windDirection}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-500">Humidity:</span>
            <span>{weatherData.humidity}%</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-500">Visibility:</span>
            <span>{weatherData.visibility}</span>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default WeatherWidget;
