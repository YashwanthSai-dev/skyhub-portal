
import React from 'react';
import { Cloud, CloudDrizzle, CloudLightning, CloudRain, CloudSnow, Sun } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface WeatherData {
  temperature: number;
  condition: 'sunny' | 'cloudy' | 'rainy' | 'stormy' | 'snowy' | 'drizzle';
  windSpeed: number;
  windDirection: string;
  humidity: number;
  visibility: string;
}

interface WeatherWidgetProps {
  data: WeatherData;
}

const WeatherWidget: React.FC<WeatherWidgetProps> = ({ data }) => {
  const renderWeatherIcon = () => {
    switch (data.condition) {
      case 'sunny':
        return <Sun className="h-10 w-10 text-yellow-500" />;
      case 'cloudy':
        return <Cloud className="h-10 w-10 text-gray-500" />;
      case 'rainy':
        return <CloudRain className="h-10 w-10 text-blue-500" />;
      case 'stormy':
        return <CloudLightning className="h-10 w-10 text-purple-500" />;
      case 'snowy':
        return <CloudSnow className="h-10 w-10 text-blue-300" />;
      case 'drizzle':
        return <CloudDrizzle className="h-10 w-10 text-blue-400" />;
      default:
        return <Sun className="h-10 w-10 text-yellow-500" />;
    }
  };

  const formatCondition = (condition: string) => {
    return condition.charAt(0).toUpperCase() + condition.slice(1);
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Current Weather</CardTitle>
        <CardDescription>Local airport conditions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-3xl font-bold">{data.temperature}°C</span>
            <span className="text-sm text-gray-500">{formatCondition(data.condition)}</span>
          </div>
          <div className="p-3 rounded-full bg-gray-100">
            {renderWeatherIcon()}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-2">
        <div className="grid grid-cols-2 gap-2 w-full text-sm">
          <div className="flex items-center gap-2">
            <span className="text-gray-500">Wind:</span>
            <span>{data.windSpeed} km/h {data.windDirection}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-500">Humidity:</span>
            <span>{data.humidity}%</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-500">Visibility:</span>
            <span>{data.visibility}</span>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default WeatherWidget;
