import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import type { ProviderTheme } from '../theme/providerThemes';

type Props = {
  value: string;
  onChangeText: (t: string) => void;
  onSubmit: () => void;
  validationMessage: string | null;
  theme: ProviderTheme;
  editable?: boolean;
};

export function LocationInput({
  value,
  onChangeText,
  onSubmit,
  validationMessage,
  theme,
  editable = true,
}: Props) {
  return (
    <View style={styles.wrap}>
      <Text style={[styles.label, { color: theme.secondaryText }]}>Location</Text>
      <TextInput
        testID="location-input"
        value={value}
        onChangeText={onChangeText}
        placeholder="e.g. London, Tokyo"
        placeholderTextColor={theme.secondaryText}
        style={[
          styles.input,
          {
            color: theme.primaryText,
            borderColor: theme.cardBorder,
            backgroundColor: theme.surface,
          },
        ]}
        autoCorrect={false}
        autoCapitalize="words"
        returnKeyType="search"
        onSubmitEditing={onSubmit}
        editable={editable}
      />
      {validationMessage ? (
        <Text testID="location-validation" style={styles.error}>
          {validationMessage}
        </Text>
      ) : null}
      <Pressable
        testID="location-submit"
        onPress={onSubmit}
        style={({ pressed }) => [
          styles.button,
          { backgroundColor: theme.accent, opacity: pressed ? 0.85 : 1 },
        ]}
      >
        <Text style={styles.buttonLabel}>Get weather</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: 20 },
  label: { marginBottom: 6, fontSize: 14 },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
  },
  error: { color: '#fecaca', marginTop: 6, fontSize: 13 },
  button: {
    marginTop: 12,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  buttonLabel: { color: '#0f172a', fontWeight: '700', fontSize: 16 },
});
