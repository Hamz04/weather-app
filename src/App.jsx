import React, { useState } from 'react';
import axios from 'axios';

const API_KEY = process.env.REACT_APP_WEATHER_KEY;

function WeatherCard({ data }) {
  return (
    <div style={{ background: '#1e1e2e', borderRadius: 16, padding: 24, color: 'white', maxWidth: 480, margin: '0 auto' }}>
      <h2>{data.name}, {data.sys.country}</h2>
      <p style={{ fontSize: 64, margin: 0 }}>{Math.round(data.main.temp)}°C</p>
      <p>{data.weather[0].description}</p>
      <div style={{ display: 'flex', gap: 24, marginTop: 16 }}>
        <span>💧 {data.main.humidity}%</span>
        <span>💨 {data.wind.speed} m/s</span>
        <span>🌡️ Feels {Math.round(data.main.feels_like)}°C</span>
      </div>
    </div>
  );
}

export default function App() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchWeather = async () => {
    if (!city) return;
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );
      setWeather(res.data);
    } catch {
      setError('City not found. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0f0f1a', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 80, fontFamily: 'sans-serif' }}>
      <h1 style={{ color: '#7c3aed', marginBottom: 32 }}>🌤️ Weather App</h1>
      <div style={{ display: 'flex', gap: 8 }}>
        <input
          value={city}
          onChange={e => setCity(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && fetchWeather()}
          placeholder="Enter city..."
          style={{ padding: '12px 16px', borderRadius: 8, border: 'none', fontSize: 16, width: 280 }}
        />
        <button onClick={fetchWeather} style={{ padding: '12px 24px', borderRadius: 8, background: '#7c3aed', color: 'white', border: 'none', cursor: 'pointer', fontSize: 16 }}>
          {loading ? '...' : 'Search'}
        </button>
      </div>
      {error && <p style={{ color: '#ef4444', marginTop: 16 }}>{error}</p>}
      {weather && <div style={{ marginTop: 32 }}><WeatherCard data={weather} /></div>}
    </div>
  );
}
