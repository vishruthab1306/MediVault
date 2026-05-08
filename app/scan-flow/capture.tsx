import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Colors, Typography } from '../../constants/theme';
import { Button } from '../../components/Button';
import { useRouter } from 'expo-router';
import { X, Image as ImageIcon } from 'lucide-react-native';

export default function CaptureScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const router = useRouter();
  const cameraRef = useRef(null);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>We need your permission to show the camera</Text>
        <Button title="Grant Permission" onPress={requestPermission} />
      </View>
    );
  }

  const handleCapture = async () => {
    // Mock capture delay
    setTimeout(() => {
      router.push('/scan-flow/name');
    }, 500);
  };

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} ref={cameraRef}>
        <View style={styles.overlay}>
          <View style={styles.topBar}>
            <TouchableOpacity onPress={() => router.back()}>
              <X size={28} color={Colors.surface} />
            </TouchableOpacity>
          </View>
          
          {/* Document guide overlay - corner markers */}
          <View style={styles.guideContainer}>
            <View style={[styles.corner, styles.topLeft]} />
            <View style={[styles.corner, styles.topRight]} />
            <View style={[styles.corner, styles.bottomLeft]} />
            <View style={[styles.corner, styles.bottomRight]} />
          </View>
        </View>
      </CameraView>

      <View style={styles.bottomDrawer}>
        <Text style={styles.instruction}>Align document within frame</Text>
        <View style={styles.controls}>
          <TouchableOpacity style={styles.galleryButton}>
            <ImageIcon size={24} color={Colors.surface} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.captureButton} onPress={handleCapture}>
            <View style={styles.captureInner} />
          </TouchableOpacity>
          <View style={{ width: 48 }} /> {/* Spacer to balance gallery button */}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.dark },
  permissionContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.dark, padding: 20 },
  permissionText: { ...Typography.body, color: Colors.surface, marginBottom: 20, textAlign: 'center' },
  camera: { flex: 1 },
  overlay: { flex: 1, justifyContent: 'space-between', padding: 24, paddingTop: 60 },
  topBar: { flexDirection: 'row', justifyContent: 'flex-start' },
  guideContainer: { flex: 1, margin: 40, position: 'relative' },
  corner: { position: 'absolute', width: 40, height: 40, borderColor: Colors.surface, borderWidth: 4 },
  topLeft: { top: 0, left: 0, borderRightWidth: 0, borderBottomWidth: 0 },
  topRight: { top: 0, right: 0, borderLeftWidth: 0, borderBottomWidth: 0 },
  bottomLeft: { bottom: 0, left: 0, borderRightWidth: 0, borderTopWidth: 0 },
  bottomRight: { bottom: 0, right: 0, borderLeftWidth: 0, borderTopWidth: 0 },
  bottomDrawer: {
    backgroundColor: Colors.dark,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 32,
    paddingBottom: 48,
    alignItems: 'center',
  },
  instruction: { ...Typography.small, color: Colors.primarySoft, marginBottom: 24 },
  controls: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%' },
  galleryButton: { width: 48, height: 48, borderRadius: 24, backgroundColor: Colors.primaryMuted, justifyContent: 'center', alignItems: 'center' },
  captureButton: { width: 80, height: 80, borderRadius: 40, backgroundColor: Colors.surface, justifyContent: 'center', alignItems: 'center' },
  captureInner: { width: 68, height: 68, borderRadius: 34, backgroundColor: Colors.primary },
});
