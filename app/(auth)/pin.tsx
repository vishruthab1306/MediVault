import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Dimensions } from 'react-native';
import { Colors, Typography } from '../../constants/theme';
import { useStore } from '../../store/useStore';
import { useRouter } from 'expo-router';
import { Delete } from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function PinScreen() {
  const [pin, setPin] = useState('');
  const { setAuthenticated } = useStore();
  const router = useRouter();

  const handlePress = (num: string) => {
    if (pin.length < 6) {
      const newPin = pin + num;
      setPin(newPin);
      if (newPin.length === 6) {
        // Authenticate when 6 digits are entered
        setTimeout(() => {
          setAuthenticated(true);
          router.replace('/(tabs)');
        }, 300);
      }
    }
  };

  const handleDelete = () => {
    if (pin.length > 0) {
      setPin(pin.slice(0, -1));
    }
  };

  const renderDots = () => {
    return (
      <View style={styles.dotsContainer}>
        {[...Array(6)].map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              index < pin.length ? styles.dotFilled : styles.dotEmpty
            ]}
          />
        ))}
      </View>
    );
  };

  const renderKeypad = () => {
    const rows = [
      ['1', '2', '3'],
      ['4', '5', '6'],
      ['7', '8', '9'],
      ['', '0', 'del']
    ];

    return (
      <View style={styles.keypadContainer}>
        {rows.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((key, colIndex) => {
              if (key === '') {
                return <View key={colIndex} style={styles.key} />;
              }
              if (key === 'del') {
                return (
                  <TouchableOpacity key={colIndex} style={styles.key} onPress={handleDelete}>
                    <Delete size={24} color={Colors.textPrimary} />
                  </TouchableOpacity>
                );
              }
              return (
                <TouchableOpacity key={colIndex} style={styles.key} onPress={() => handlePress(key)}>
                  <Text style={styles.keyText}>{key}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topHalf}>
        <View style={styles.waveEdge} />
        <View style={styles.topContent}>
          <Text style={styles.title}>Enter PIN</Text>
          <Text style={styles.subtitle}>Enter your 6-digit secure PIN</Text>
          {renderDots()}
        </View>
      </View>
      <View style={styles.bottomHalf}>
        {renderKeypad()}
        <TouchableOpacity style={styles.forgotButton}>
          <Text style={styles.forgotText}>Forgot PIN?</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primaryPale,
  },
  topHalf: {
    flex: 0.4,
    backgroundColor: Colors.dark,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  waveEdge: {
    // A simplified curved edge using border radius on the container
  },
  topContent: {
    alignItems: 'center',
    paddingTop: 40,
  },
  title: {
    ...Typography.h2,
    color: Colors.surface,
    marginBottom: 8,
  },
  subtitle: {
    ...Typography.body,
    color: Colors.primarySoft,
    marginBottom: 32,
  },
  dotsContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  dot: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  dotEmpty: {
    backgroundColor: Colors.primaryMuted,
  },
  dotFilled: {
    backgroundColor: Colors.primary,
  },
  bottomHalf: {
    flex: 0.6,
    justifyContent: 'space-between',
    paddingVertical: 40,
    paddingHorizontal: 24,
  },
  keypadContainer: {
    alignItems: 'center',
    gap: 16,
  },
  row: {
    flexDirection: 'row',
    gap: 16,
  },
  key: {
    width: (width - 48 - 32) / 3, // Full width minus padding minus gaps divided by 3
    height: 64,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  keyText: {
    ...Typography.h2,
    color: Colors.textPrimary,
  },
  forgotButton: {
    alignSelf: 'center',
    padding: 16,
  },
  forgotText: {
    ...Typography.small,
    color: Colors.primary,
    textDecorationLine: 'underline',
  },
});
