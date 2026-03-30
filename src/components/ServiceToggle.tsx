import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { WeatherServiceId } from '../weather/types';
import { getWeatherServiceMeta, listWeatherServiceIds } from '../weather/registry';
import type { ProviderTheme } from '../theme/providerThemes';

type Props = {
  activeId: WeatherServiceId;
  onSelect: (id: WeatherServiceId) => void;
  theme: ProviderTheme;
};

export function ServiceToggle({ activeId, onSelect, theme }: Props) {
  const ids = listWeatherServiceIds();

  return (
    <View style={styles.row} accessibilityRole="tablist">
      {ids.map((id) => {
        const active = id === activeId;
        const { displayName } = getWeatherServiceMeta(id);
        return (
          <Pressable
            key={id}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            onPress={() => onSelect(id)}
            style={[
              styles.chip,
              {
                backgroundColor: active ? theme.toggleActive : theme.toggleInactive,
                borderColor: theme.cardBorder,
              },
            ]}
          >
            <Text
              style={[
                styles.chipText,
                { color: active ? '#ffffff' : theme.secondaryText },
              ]}
            >
              {displayName}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  chip: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 999,
    borderWidth: 1,
  },
  chipText: {
    fontWeight: '600',
    fontSize: 14,
  },
});
