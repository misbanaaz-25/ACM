import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/theme';
import HomeIcon from '@/components/ui/Icon/home_icon';
import CallLogsIcon from '@/components/ui/Icon/call_logs_icon';
import ManageAccessIcon from '@/components/ui/Icon/manage_access_icon';

type Props = {
  active?: string; // 'home' | 'calls' | 'access'
};

export default function BottomBar({ active = 'home' }: Props) {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const colors = Colors.light;

  return (
    <View style={[styles.bottomBar, { width: width - 40, backgroundColor: colors.primary }]}>

      <TouchableOpacity style={styles.bottomTab} onPress={() => router.push('/main')}>
        <HomeIcon size={22} color={colors.white} />
        <Text style={[styles.bottomTabText, { color: colors.white }, active === 'home' && styles.activeText]}>
          Home
        </Text>
        {active === 'home' && <View style={[styles.activeIndicator, { backgroundColor: colors.white }]} />}
      </TouchableOpacity>

      <TouchableOpacity style={styles.bottomTab} onPress={() => router.push('/blocked_call')}>
        <CallLogsIcon size={22} color={colors.white} />
        <Text style={[styles.bottomTabText, { color: colors.white }, active === 'calls' && styles.activeText]}>
          Call logs
        </Text>
        {active === 'calls' && <View style={[styles.activeIndicator, { backgroundColor: colors.white }]} />}
      </TouchableOpacity>

      <TouchableOpacity style={styles.bottomTab} onPress={() => router.push('/manage_access')}>
        <ManageAccessIcon size={22} color={colors.white} />
        <Text style={[styles.bottomTabText, { color: colors.white }, active === 'access' && styles.activeText]}>
          Manage access
        </Text>
        {active === 'access' && <View style={[styles.activeIndicator, { backgroundColor: colors.white }]} />}
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  bottomBar: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    borderRadius: 99,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingVertical: 14,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  bottomTab: {
    alignItems: 'center',
    gap: 4,
  },
  bottomTabText: {
    fontSize: 11,
    fontWeight: '600',
  },
  activeText: {
    fontWeight: '700',
  },
  activeIndicator: {
    width: 20,
    height: 3,
    borderRadius: 99,
    marginTop: 2,
  },
});