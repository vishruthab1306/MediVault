import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { Colors, Typography } from '../../constants/theme';
import { useStore } from '../../store/useStore';
import { ChevronRight, Shield, Cloud, LogOut, QrCode } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
  const { profile, setAuthenticated } = useStore();
  const router = useRouter();

  const handleLogout = () => {
    setAuthenticated(false);
    router.replace('/(auth)');
  };

  const renderSettingRow = (label: string, value?: string, isDestructive = false, onPress?: () => void) => (
    <TouchableOpacity style={styles.settingRow} onPress={onPress}>
      <Text style={[styles.settingLabel, isDestructive && styles.destructiveText]}>{label}</Text>
      <View style={styles.settingRight}>
        {value && <Text style={styles.settingValue}>{value}</Text>}
        <ChevronRight size={20} color={isDestructive ? Colors.error : Colors.textSecondary} />
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        
        {/* Top Section */}
        <View style={styles.topSection}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>{profile?.name?.[0]}</Text>
          </View>
          <Text style={styles.userName}>{profile?.name}</Text>
          <Text style={styles.userEmail}>user@gmail.com</Text>
        </View>

        {/* Emergency Access Card */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>EMERGENCY ACCESS</Text>
          <View style={styles.emergencyCard}>
            <View style={styles.emergencyHeader}>
              <View>
                <Text style={styles.emergencyTitle}>Emergency Card</Text>
                <Text style={styles.emergencySubtitle}>{profile?.bloodType} • {profile?.allergies?.length} Allergies</Text>
              </View>
              <QrCode size={32} color={Colors.primary} />
            </View>
            <TouchableOpacity style={styles.shareQRButton}>
              <Text style={styles.shareQRText}>Share QR / PDF</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Medical Info */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>MEDICAL INFO</Text>
          <View style={styles.settingsGroup}>
            {renderSettingRow('Blood Type', profile?.bloodType)}
            {renderSettingRow('Height & Weight', `${profile?.height} cm, ${profile?.weight} kg`)}
            {renderSettingRow('Known Allergies', profile?.allergies?.join(', '))}
            {renderSettingRow('Chronic Conditions', profile?.conditions?.join(', '))}
            {renderSettingRow('Emergency Contact', profile?.emergencyContact?.name)}
          </View>
        </View>

        {/* Cloud & Security */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>CLOUD & SECURITY</Text>
          <View style={styles.settingsGroup}>
            <TouchableOpacity style={styles.settingRow}>
              <View style={styles.settingRowLeft}>
                <Cloud size={20} color={Colors.textPrimary} style={{ marginRight: 12 }} />
                <Text style={styles.settingLabel}>Cloud Backup</Text>
              </View>
              <View style={styles.settingRight}>
                <View style={styles.syncDot} />
                <Text style={styles.settingValue}>Synced Just now</Text>
                <ChevronRight size={20} color={Colors.textSecondary} />
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.settingRow}>
              <View style={styles.settingRowLeft}>
                <Shield size={20} color={Colors.textPrimary} style={{ marginRight: 12 }} />
                <Text style={styles.settingLabel}>Change 6-digit PIN</Text>
              </View>
              <ChevronRight size={20} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Logout */}
        <View style={[styles.section, { marginBottom: 40 }]}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <LogOut size={20} color={Colors.error} />
            <Text style={styles.logoutText}>Sign Out</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.primaryPale },
  scroll: { flex: 1 },
  content: { paddingBottom: 100 },
  topSection: { backgroundColor: Colors.dark, padding: 32, paddingTop: 60, alignItems: 'center', borderBottomLeftRadius: 32, borderBottomRightRadius: 32 },
  avatarCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  avatarText: { ...Typography.h1, color: Colors.surface },
  userName: { ...Typography.h2, color: Colors.surface, marginBottom: 4 },
  userEmail: { ...Typography.small, color: Colors.primarySoft },
  section: { marginTop: 32, paddingHorizontal: 20 },
  sectionHeader: { ...Typography.tiny, fontFamily: 'DMSans_600SemiBold', color: Colors.primary, letterSpacing: 1, marginBottom: 12 },
  emergencyCard: { backgroundColor: Colors.dark, borderRadius: 16, padding: 20, borderLeftWidth: 4, borderLeftColor: Colors.primary },
  emergencyHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  emergencyTitle: { ...Typography.h3, color: Colors.surface, marginBottom: 4 },
  emergencySubtitle: { ...Typography.small, color: Colors.primarySoft },
  shareQRButton: { backgroundColor: Colors.primaryMuted, padding: 12, borderRadius: 8, alignItems: 'center' },
  shareQRText: { ...Typography.small, color: Colors.primary, fontFamily: 'DMSans_600SemiBold' },
  settingsGroup: { backgroundColor: Colors.surface, borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: Colors.border },
  settingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: Colors.primaryPale },
  settingRowLeft: { flexDirection: 'row', alignItems: 'center' },
  settingLabel: { ...Typography.body, color: Colors.textPrimary },
  settingRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  settingValue: { ...Typography.small, color: Colors.textSecondary },
  destructiveText: { color: Colors.error },
  syncDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.success },
  logoutButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 16, gap: 12, backgroundColor: Colors.surface, borderRadius: 16, borderWidth: 1, borderColor: Colors.border },
  logoutText: { ...Typography.body, fontFamily: 'DMSans_600SemiBold', color: Colors.error },
});
