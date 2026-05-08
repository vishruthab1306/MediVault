import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { useFonts, DMSans_400Regular, DMSans_500Medium, DMSans_600SemiBold, DMSans_700Bold } from '@expo-google-fonts/dm-sans';
import { useStore } from '../store/useStore';
import { View, ActivityIndicator } from 'react-native';
import { Colors } from '../constants/theme';

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_600SemiBold,
    DMSans_700Bold,
  });

  const { isAuthenticated } = useStore();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!fontsLoaded) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!isAuthenticated && !inAuthGroup) {
      // Redirect to the splash/login screen
      router.replace('/(auth)');
    } else if (isAuthenticated && inAuthGroup) {
      // Redirect away from the login screen
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, segments, fontsLoaded]);

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, backgroundColor: Colors.dark, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="record/[id]" options={{ presentation: 'card', headerShown: false }} />
      <Stack.Screen name="scan-flow" options={{ presentation: 'fullScreenModal', headerShown: false }} />
    </Stack>
  );
}
