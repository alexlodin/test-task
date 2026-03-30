import { useCallback, useEffect, useState } from 'react';
import { createWeatherService, DEFAULT_WEATHER_SERVICE_ID } from '../weather/registry';
import type { NormalizedWeather, WeatherServiceId } from '../weather/types';
import { WeatherServiceError } from '../weather/types';
import { validateLocationInput } from '../validation/locationValidation';

export function useWeatherScreenState() {
  const [serviceId, setServiceId] = useState<WeatherServiceId>(
    DEFAULT_WEATHER_SERVICE_ID
  );
  const [inputValue, setInputValue] = useState('');
  const [validationMessage, setValidationMessage] = useState<string | null>(null);
  const [activeQuery, setActiveQuery] = useState<string | null>(null);
  const [weather, setWeather] = useState<NormalizedWeather | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runFetch = useCallback(async (query: string, id: WeatherServiceId) => {
    setLoading(true);
    setError(null);
    try {
      const svc = createWeatherService(id);
      const result = await svc.fetchWeather(query);
      setWeather(result);
    } catch (e) {
      setWeather(null);
      if (e instanceof WeatherServiceError) {
        setError(e.message);
      } else {
        setError('Something went wrong.');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeQuery === null) return;
    void runFetch(activeQuery, serviceId);
  }, [activeQuery, serviceId, runFetch]);

  const submitLocation = useCallback(() => {
    const v = validateLocationInput(inputValue);
    if (!v.ok) {
      setValidationMessage(v.message);
      return;
    }
    setValidationMessage(null);
    setActiveQuery(v.value);
  }, [inputValue]);

  const selectService = useCallback((id: WeatherServiceId) => {
    setServiceId(id);
  }, []);

  return {
    serviceId,
    inputValue,
    setInputValue,
    validationMessage,
    weather,
    loading,
    error,
    submitLocation,
    selectService,
    activeQuery,
  };
}
