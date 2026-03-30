import { act, renderHook, waitFor } from '@testing-library/react-native';
import * as registry from '../weather/registry';
import type { NormalizedWeather } from '../weather/types';
import { useWeatherScreenState } from '../hooks/useWeatherScreenState';

describe('useWeatherScreenState', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('refetches when the user toggles service after a successful lookup', async () => {
    const openResult: NormalizedWeather = {
      locationLabel: 'Paris, France',
      temperatureC: 10,
      description: 'Clear sky',
      providerId: 'open-meteo',
      fetchedAtIso: '2026-01-01T12:00:00.000Z',
    };
    const wttrResult: NormalizedWeather = {
      locationLabel: 'Paris',
      temperatureC: 11,
      description: 'Sunny',
      providerId: 'wttr-in',
      fetchedAtIso: '2026-01-01T12:00:01.000Z',
    };

    const fetchOpen = jest.fn().mockResolvedValue(openResult);
    const fetchWttr = jest.fn().mockResolvedValue(wttrResult);

    jest.spyOn(registry, 'createWeatherService').mockImplementation((id) => {
      if (id === 'open-meteo') {
        return {
          id: 'open-meteo',
          displayName: 'Open-Meteo',
          fetchWeather: fetchOpen,
        };
      }
      return {
        id: 'wttr-in',
        displayName: 'wttr.in',
        fetchWeather: fetchWttr,
      };
    });

    const { result } = renderHook(() => useWeatherScreenState());

    act(() => {
      result.current.setInputValue('Paris');
    });
    act(() => {
      result.current.submitLocation();
    });

    await waitFor(() => expect(fetchOpen).toHaveBeenCalledWith('Paris'));
    await waitFor(() => expect(result.current.weather?.temperatureC).toBe(10));

    act(() => {
      result.current.selectService('wttr-in');
    });

    await waitFor(() => expect(fetchWttr).toHaveBeenCalledWith('Paris'));
    await waitFor(() => expect(result.current.weather?.temperatureC).toBe(11));
  });

  it('surfaces validation errors without calling the network', async () => {
    jest.spyOn(registry, 'createWeatherService');

    const { result } = renderHook(() => useWeatherScreenState());

    act(() => {
      result.current.setInputValue('x');
    });
    act(() => {
      result.current.submitLocation();
    });

    expect(result.current.validationMessage).toBeTruthy();
    expect(registry.createWeatherService).not.toHaveBeenCalled();
  });
});
