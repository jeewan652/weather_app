import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './WeatherPage.css'; // Import CSS file for styling
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons'; // Import the icon you want to use

interface WeatherData {
    city: string;
    temperature: number;
    weather: string;
    humidity: number;
    windSpeed: number;
    pressure: number;
    // Add more weather data properties as needed
}

const WeatherPage: React.FC = () => {
    const { cityName } = useParams<{ cityName: string }>();
    const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const apiKey = 'b274a93c33fc56de0985dbe8a80b3ab0'; // Replace with your actual API key
        const fetchWeatherData = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`);
                const data = response.data;
                setWeatherData({
                    city: data.name,
                    temperature: data.main.temp,
                    weather: data.weather[0].description,
                    humidity: data.main.humidity,
                    windSpeed: data.wind.speed,
                    pressure: data.main.pressure,
                    // Add more weather data properties as needed
                });
            } catch (error) {
                setError('Error fetching weather data');
            } finally {
                setLoading(false);
            }
        };

        fetchWeatherData();
    }, [cityName]);

    useEffect(() => {
        document.title = `Weather for ${weatherData?.city || 'City'}`;
    }, [weatherData?.city]);

    if (loading) {
        return <div className="text-center mt-4">Loading...</div>;
    }

    if (error) {
        return <div className="text-center mt-4">Error: {error}</div>;
    }

    // Determine background based on weather condition
    let backgroundClass = 'weather-card';
    if (weatherData) {
        const weatherCondition = weatherData.weather.toLowerCase();
        if (weatherCondition.includes('clear')) {
            backgroundClass += ' clear-sky';
        } else if (weatherCondition.includes('cloud')) {
            backgroundClass += ' cloudy';
        } else if (weatherCondition.includes('rain')) {
            backgroundClass += ' rainy';
        } else if (weatherCondition.includes('snow')) {
            backgroundClass += ' snowy';
        }
    }

    return (
        <div className={`max-w-lg mx-auto mt-48 ${backgroundClass}`}>
            <h1 className="text-3xl font-bold mb-4">
                {weatherData?.city}
                <span className="ml-2"><FontAwesomeIcon icon={faMapMarkerAlt} /></span>
            </h1>
            <p className="mb-2">Temperature: {weatherData?.temperature}°C</p>
            <p className="mb-2">Weather: {weatherData?.weather}</p>
            <p className="mb-2">Humidity: {weatherData?.humidity}%</p>
            <p className="mb-2">Wind Speed: {weatherData?.windSpeed} m/s</p>
            <p className="mb-2">Pressure: {weatherData?.pressure} hPa</p>
            {/* Add optional features like map display and unit conversion */}
        </div>
    );
};

export default WeatherPage;
