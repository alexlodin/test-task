import { StatusBar } from 'expo-status-bar';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { LocationInput } from '../components/LocationInput';
import { ServiceToggle } from '../components/ServiceToggle';
import { WeatherDisplay } from '../components/WeatherDisplay';
import { useWeatherScreenState } from '../hooks/useWeatherScreenState';
import { getThemeForProvider } from '../theme/providerThemes';

export function WeatherScreen() {
  const {
    serviceId,
    inputValue,
    setInputValue,
    validationMessage,
    weather,
    loading,
    error,
    submitLocation,
    selectService,
  } = useWeatherScreenState();

  const theme = getThemeForProvider(serviceId);

  return (
    <View style={[styles.root, { backgroundColor: theme.background }]}>
      <StatusBar style={theme.statusBarStyle} />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Text style={styles.glyph}>{theme.brandGlyph}</Text>
            <Text style={[styles.title, { color: theme.primaryText }]}>
              Weather
            </Text>
            <Text style={[styles.sub, { color: theme.secondaryText }]}>
              Theme follows the selected service
            </Text>
          </View>

          <ServiceToggle activeId={serviceId} onSelect={selectService} theme={theme} />

          <LocationInput
            value={inputValue}
            onChangeText={setInputValue}
            onSubmit={submitLocation}
            validationMessage={validationMessage}
            theme={theme}
            editable={!loading}
          />

          <WeatherDisplay
            loading={loading}
            error={error}
            weather={weather}
            theme={theme}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  flex: { flex: 1 },
  scroll: {
    paddingHorizontal: 20,
    paddingTop: 56,
    paddingBottom: 32,
  },
  header: { marginBottom: 20 },
  glyph: { fontSize: 40, marginBottom: 4 },
  title: { fontSize: 28, fontWeight: '800' },
  sub: { fontSize: 14, marginTop: 4 },
});
