import { fireEvent, render, screen } from '@testing-library/react-native';
import { LocationInput } from '../components/LocationInput';
import { getThemeForProvider } from '../theme/providerThemes';

describe('LocationInput', () => {
  const theme = getThemeForProvider('open-meteo');

  it('calls onSubmit when the button is pressed', () => {
    const onSubmit = jest.fn();
    render(
      <LocationInput
        value="Tokyo"
        onChangeText={jest.fn()}
        onSubmit={onSubmit}
        validationMessage={null}
        theme={theme}
      />
    );
    fireEvent.press(screen.getByTestId('location-submit'));
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it('shows validation message from props', () => {
    render(
      <LocationInput
        value=""
        onChangeText={jest.fn()}
        onSubmit={jest.fn()}
        validationMessage="Too short."
        theme={theme}
      />
    );
    expect(screen.getByTestId('location-validation').props.children).toBe(
      'Too short.'
    );
  });
});
