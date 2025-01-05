import { RootProvider } from '@/components/root-provider';
import { Slot } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import 'react-native-reanimated';

// Import global styles
import './global.css';

// Prevent the splash screen from auto-hiding before asset loading is complete.
void SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  return (
    <RootProvider>
      <Slot />
    </RootProvider>
  );
}
