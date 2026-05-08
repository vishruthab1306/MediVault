import { Stack } from 'expo-router';

export default function ScanFlowLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="capture" />
      <Stack.Screen name="name" />
      <Stack.Screen name="process" />
      <Stack.Screen name="results" />
    </Stack>
  );
}
