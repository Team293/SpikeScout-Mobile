import { Stack } from 'expo-router';





export default function DataLayout() {
  return (
    <Stack>
      <Stack.Screen name="data" options={{ title: 'Local Data ' }} />
    </Stack>
  );
}
