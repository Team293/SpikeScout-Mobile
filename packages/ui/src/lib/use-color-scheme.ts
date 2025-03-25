import { useColorScheme as useNativewindColorScheme } from 'nativewind';





export function useColorScheme() {
  const nativewindColorScheme = useNativewindColorScheme();

  return {
    colorScheme: 'light',
    isDarkColorScheme: false,
    setColorScheme: nativewindColorScheme.setColorScheme.bind(
      nativewindColorScheme,
    ),
    toggleColorScheme: nativewindColorScheme.toggleColorScheme.bind(
      nativewindColorScheme,
    ),
  };
}
