import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import type { NormalizedWeather } from '../weather/types';
import type { ProviderTheme } from '../theme/providerThemes';

type Props = {
  loading: boolean;
  error: string | null;
  weather: NormalizedWeather | null;
  theme: ProviderTheme;
};

export function WeatherDisplay({ loading, error, weather, theme }: Props) {
  if (loading) {
    return (
      <View style={styles.center} accessibilityLabel="Loading weather">
        <ActivityIndicator size="large" color={theme.accent} />
        <Text style={[styles.muted, { color: theme.secondaryText }]}>
          Fetching…
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.cardWrap}>
        <View
          style={[
            styles.card,
            {
              borderColor: '#f87171',
              backgroundColor: theme.surface,
            },
          ]}
        >
          <Text testID="weather-error" style={styles.errorTitle}>
            {error}
          </Text>
        </View>
      </View>
    );
  }

  if (!weather) {
    return (
      <Text style={[styles.muted, { color: theme.secondaryText }]}>
        Enter a location and choose a weather source to see the forecast.
      </Text>
    );
  }

  return (
    <View style={styles.cardWrap}>
      <View
        style={[
          styles.card,
          { borderColor: theme.cardBorder, backgroundColor: theme.surface },
        ]}
      >
        <Text style={[styles.place, { color: theme.primaryText }]}>
          {weather.locationLabel}
        </Text>
        <Text testID="weather-temp" style={[styles.temp, { color: theme.accent }]}>
          {Math.round(weather.temperatureC)}°C
        </Text>
        <Text style={[styles.desc, { color: theme.secondaryText }]}>
          {weather.description}
        </Text>
        {weather.humidityPercent !== undefined ? (
          <Text style={[styles.meta, { color: theme.secondaryText }]}>
            Humidity: {weather.humidityPercent}%
          </Text>
        ) : null}
        {weather.windSpeedKmh !== undefined ? (
          <Text style={[styles.meta, { color: theme.secondaryText }]}>
            Wind: {Math.round(weather.windSpeedKmh)} km/h
          </Text>
        ) : null}
        <Text style={[styles.footer, { color: theme.secondaryText }]}>
          via {weather.providerId} · {new Date(weather.fetchedAtIso).toLocaleTimeString()}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { alignItems: 'center', paddingVertical: 24, gap: 12 },
  muted: { textAlign: 'center', fontSize: 15 },
  cardWrap: { width: '100%' },
  card: {
    borderWidth: 2,
    borderRadius: 16,
    padding: 20,
  },
  place: { fontSize: 20, fontWeight: '700' },
  temp: { fontSize: 48, fontWeight: '200', marginVertical: 8 },
  desc: { fontSize: 17, marginBottom: 8 },
  meta: { fontSize: 15, marginTop: 4 },
  footer: { fontSize: 12, marginTop: 16, opacity: 0.85 },
  errorTitle: { color: '#fecaca', fontSize: 16 },
});
