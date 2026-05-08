import React from 'react';
import { Tabs } from 'expo-router';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Shadows, Typography } from '../../constants/theme';
import { Home, FileText, Camera, Clock, User } from 'lucide-react-native';
import { useRouter } from 'expo-router';

// Custom button for the central Scan tab
const CustomScanButton = ({ children, onPress }: any) => (
  <TouchableOpacity
    style={styles.scanButtonContainer}
    onPress={onPress}
    activeOpacity={0.8}
  >
    <View style={styles.scanButton}>
      {children}
    </View>
  </TouchableOpacity>
);

export default function TabLayout() {
  const router = useRouter();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.dark,
          borderTopWidth: 0,
          elevation: 0,
          height: 80,
          paddingBottom: 20,
          paddingTop: 10,
        },
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textSecondary,
        tabBarLabelStyle: {
          ...Typography.tiny,
          fontFamily: 'DMSans_500Medium',
          marginTop: 4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color }) => <Home size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="records"
        options={{
          title: 'Records',
          tabBarIcon: ({ color }) => <FileText size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="scan"
        options={{
          title: '', // Empty label for the central button
          tabBarIcon: () => <Camera size={28} color={Colors.surface} />,
          tabBarButton: (props) => (
            <CustomScanButton
              {...props}
              onPress={() => {
                // Navigate to the scan flow instead of just the tab
                router.push('/scan-flow/capture');
              }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="timeline"
        options={{
          title: 'Timeline',
          tabBarIcon: ({ color }) => <Clock size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <User size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  scanButtonContainer: {
    top: -20,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.button,
  },
  scanButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
