import React, { useEffect, useState } from 'react';
import { api } from '../api/apiClient';
import { useAuth } from '../context/AuthContext';
import {
  CloudSun,
  Wind,
  Droplets,
  Thermometer,
  AlertTriangle,
  RefreshCw,
  Calendar,
  CloudRain
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

export function WeatherDashboardPage() {
  const { profile } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchWeather = async () => {
    try {
      setLoading(true);
      const res = await api.getWeatherForecast(profile?.latitude, profile?.longitude);
      if (res?.data) {
        setData(res.data);
      }
    } catch (err) {
      console.warn('Weather fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
  }, [profile]);

  if (loading) {
    return (
      <div className="py-20 text-center space-y-3">
        <div className="animate-spin w-8 h-8 border-4 border-agri-600 border-t-transparent rounded-full mx-auto" />
        <p className="text-xs font-bold text-slate-500">Retrieving agrometeorology from Open-Meteo...</p>
      </div>
    );
  }

  const chartData = (data?.daily || []).map((day) => ({
    name: day.date.substring(5),
    max: day.tempMax,
    min: day.tempMin,
    rain: day.precipitationMm
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
            <CloudSun className="w-6 h-6 text-amber-500" />
            Agrometeorology & Weather Alerts
          </h1>
          <p className="text-xs text-slate-500">
            Real-time atmospheric monitoring, evapotranspiration estimates, and crop spray windows for {profile?.district || 'Guntur'}, {profile?.state || 'Andhra Pradesh'}.
          </p>
        </div>

        <button
          onClick={fetchWeather}
          className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition flex items-center gap-1.5 shadow-xs"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Weather</span>
        </button>
      </div>

      {/* Current Conditions Card */}
      {data?.current && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <CloudSun className="w-10 h-10" />
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black text-slate-900">{data.current.temperature}°C</span>
                <span className="text-xs font-bold text-slate-500 capitalize">{data.current.condition}</span>
              </div>
              <p className="text-xs text-slate-400 mt-1">Live coordinate: {data.latitude.toFixed(2)}°N, {data.longitude.toFixed(2)}°E</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 text-center w-full md:w-auto">
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="flex items-center justify-center gap-1 text-slate-400 text-xs mb-1">
                <Droplets className="w-3.5 h-3.5 text-blue-500" />
                <span>Humidity</span>
              </div>
              <span className="text-base font-black text-slate-800">{data.current.humidity}%</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="flex items-center justify-center gap-1 text-slate-400 text-xs mb-1">
                <Wind className="w-3.5 h-3.5 text-slate-500" />
                <span>Wind</span>
              </div>
              <span className="text-base font-black text-slate-800">{data.current.windSpeedKmh} km/h</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="flex items-center justify-center gap-1 text-slate-400 text-xs mb-1">
                <CloudRain className="w-3.5 h-3.5 text-cyan-500" />
                <span>Rainfall</span>
              </div>
              <span className="text-base font-black text-slate-800">{data.current.precipitationMm} mm</span>
            </div>
          </div>
        </div>
      )}

      {/* Farming Alerts */}
      {data?.alerts && data.alerts.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">Agricultural Field Warnings</h2>
          {data.alerts.map((alert, idx) => (
            <div key={idx} className="p-4 bg-amber-50 border-l-4 border-amber-500 rounded-2xl flex items-start gap-3 shadow-xs">
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="text-xs flex-1">
                <h4 className="font-bold text-amber-900">{alert.title}</h4>
                <p className="text-amber-800 mt-0.5">{alert.message}</p>
                <p className="text-amber-950 font-semibold mt-1">Recommended Action: {alert.action}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Temperature Trend Chart */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
          <Thermometer className="w-4 h-4 text-rose-600" />
          7-Day Temperature Range (°C)
        </h3>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="tempMax" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="tempMin" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} domain={['dataMin - 2', 'dataMax + 2']} />
              <Tooltip />
              <Area type="monotone" dataKey="max" stroke="#f43f5e" fillOpacity={1} fill="url(#tempMax)" name="Max Temp (°C)" />
              <Area type="monotone" dataKey="min" stroke="#0ea5e9" fillOpacity={1} fill="url(#tempMin)" name="Min Temp (°C)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 7-Day Daily Forecast Carousel Cards */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-agri-600" />
          Daily Agrometeorological Forecast
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {(data?.daily || []).map((day, idx) => (
            <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-center space-y-2">
              <span className="text-[11px] font-bold text-slate-500 block">{day.date.substring(5)}</span>
              <p className="text-sm font-black text-slate-800">{day.tempMax}° / {day.tempMin}°</p>
              <p className="text-[10px] text-slate-500 font-medium truncate">{day.condition}</p>
              <div className="pt-1 border-t border-slate-200 text-[10px] font-semibold text-cyan-800">
                Rain: {day.precipitationMm} mm
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

