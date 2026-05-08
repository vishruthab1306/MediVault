import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { Colors, Typography } from '../../constants/theme';
import { useStore } from '../../store/useStore';
import { Card } from '../../components/Card';
import { ChevronRight, Activity, Heart, Droplets } from 'lucide-react-native';

export default function DashboardScreen() {
  const { profile } = useStore();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Good morning, {profile?.name?.split(' ')[0] || 'User'}</Text>
        <Text style={styles.subtitle}>Here's your health summary</Text>
      </View>
      
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        
        {/* Emergency Banner */}
        <TouchableOpacity style={styles.emergencyBanner} activeOpacity={0.9}>
          <View style={styles.emergencyLeft}>
            <Text style={styles.emergencyTitle}>Emergency Card</Text>
            <Text style={styles.emergencySubtitle}>Tap to share</Text>
          </View>
          <ChevronRight size={20} color={Colors.primary} />
        </TouchableOpacity>

        {/* Health Summary Cards */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.summaryScroll} contentContainerStyle={styles.summaryContainer}>
          <Card style={styles.summaryCard}>
            <View style={styles.iconCircle}>
              <Droplets size={20} color={Colors.primary} />
            </View>
            <Text style={styles.summaryCardTitle}>Blood Type</Text>
            <Text style={styles.summaryCardValue}>{profile?.bloodType || '--'}</Text>
          </Card>
          
          <Card style={styles.summaryCard}>
            <View style={styles.iconCircle}>
              <Activity size={20} color={Colors.primary} />
            </View>
            <Text style={styles.summaryCardTitle}>Last Vitals</Text>
            <Text style={styles.summaryCardValue}>120/80</Text>
          </Card>
          
          <Card style={styles.summaryCard}>
            <View style={styles.iconCircle}>
              <Heart size={20} color={Colors.primary} />
            </View>
            <Text style={styles.summaryCardTitle}>Allergies</Text>
            <Text style={styles.summaryCardValue}>{profile?.allergies?.length || 0}</Text>
          </Card>
        </ScrollView>

        {/* Trend Insights - Placeholders */}
        <Text style={styles.sectionTitle}>Trend Insights</Text>
        <Card style={styles.trendCard}>
          <View style={styles.trendHeader}>
            <Text style={styles.trendTitle}>Blood Pressure</Text>
            <TouchableOpacity>
              <Text style={styles.logText}>+ Log</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.chartPlaceholder}>
            <Text style={styles.chartPlaceholderText}>Chart Data</Text>
          </View>
        </Card>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.primaryPale,
  },
  header: {
    backgroundColor: Colors.dark,
    padding: 24,
    paddingTop: 40,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  greeting: {
    ...Typography.h3,
    color: Colors.surface,
    marginBottom: 4,
  },
  subtitle: {
    ...Typography.small,
    color: Colors.primarySoft,
  },
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  emergencyBanner: {
    backgroundColor: Colors.dark,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
  },
  emergencyLeft: {
    gap: 4,
  },
  emergencyTitle: {
    ...Typography.body,
    fontFamily: 'DMSans_600SemiBold',
    color: Colors.surface,
  },
  emergencySubtitle: {
    ...Typography.small,
    color: Colors.primarySoft,
  },
  summaryScroll: {
    marginBottom: 24,
    marginHorizontal: -20,
  },
  summaryContainer: {
    paddingHorizontal: 20,
    gap: 16,
  },
  summaryCard: {
    width: 140,
    padding: 16,
    alignItems: 'flex-start',
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primaryMuted,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryCardTitle: {
    ...Typography.small,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  summaryCardValue: {
    ...Typography.h2,
    color: Colors.textPrimary,
  },
  sectionTitle: {
    ...Typography.h3,
    color: Colors.textPrimary,
    marginBottom: 16,
  },
  trendCard: {
    marginBottom: 16,
  },
  trendHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  trendTitle: {
    ...Typography.body,
    fontFamily: 'DMSans_600SemiBold',
    color: Colors.textPrimary,
  },
  logText: {
    ...Typography.small,
    color: Colors.primary,
    fontFamily: 'DMSans_600SemiBold',
  },
  chartPlaceholder: {
    height: 120,
    backgroundColor: Colors.primaryPale,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chartPlaceholderText: {
    color: Colors.textSecondary,
    ...Typography.small,
  },
});
