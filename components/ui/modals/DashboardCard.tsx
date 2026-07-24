import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/theme';

interface DashboardCardProps {
  cardWidth: number;
  activeProfile: string;
  profileEndTime: number | null;
  onDeleteProfile: () => void;
}

// milliseconds ko "00 hr: 00 min: 00 sec" format mein badalta hai
function formatRemaining(ms: number): string {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const hrs = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(hrs)} hr: ${pad(mins)} min: ${pad(secs)} sec`;
}

export default function DashboardCard({
    cardWidth, activeProfile, profileEndTime, onDeleteProfile }: DashboardCardProps)
{
  const router = useRouter();
  const colors = Colors.light;
  const hasActiveProfile = activeProfile !== 'No profile';
  const [remainingMs, setRemainingMs] = useState<number>(
      profileEndTime ? profileEndTime - Date.now() : 0
  );

  // har second countdown update karo jab tak profileEndTime set hai
  useEffect(() => {
    if (!profileEndTime) {
      setRemainingMs(0);
      return;
    }

    setRemainingMs(profileEndTime - Date.now());

    const interval = setInterval(() => {
      const left = profileEndTime - Date.now();
      setRemainingMs(left);

      // time khatam hote hi profile ko reset karne ke liye parent ko batao
      if (left <= 0) {
        clearInterval(interval);
        onDeleteProfile();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [profileEndTime]);

  const timerLabel = profileEndTime ? formatRemaining(remainingMs) : '00 hr: 00 min: 00 sec';


  return (
    <View style={[styles.card, { width: cardWidth, backgroundColor: colors.white }]}>
      <Text style={[styles.cardTitle, { color: colors.text }]}>Dashboard</Text>

      <View style={[styles.timerBox, { borderColor: colors.border }]}>
        <Text style={[styles.timerText, { color: colors.primary }]}>{timerLabel}</Text>
        <Text style={[styles.timerLabel, { color: colors.text }]}>My Profile</Text>

        <View style={styles.profileValueRow}>
          <Text style={[styles.timerValue, { color: colors.primary }]}>{activeProfile}</Text>

          {/* profile active hai tabhi delete/reset icon dikhao */}
          {hasActiveProfile && (
            <TouchableOpacity onPress={onDeleteProfile} style={styles.deleteIconBtn}>
              <Text style={[styles.timerText, { color: colors.primary }]}>Remove profile</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.statRow}>
        <TouchableOpacity
          style={[styles.statBox, { borderColor: colors.border }]}
          onPress={() => router.push('/ScheduleProfile')}
        >
          <Text style={[styles.statTitle, { color: colors.text }]}>No Profile</Text>
          <View style={styles.statLinkRow}>
            <Text style={[styles.statLink, { color: colors.primary }]}>Schedule Profile</Text>
            <Ionicons name="chevron-forward" size={14} color={colors.primary} style={{ marginLeft: -23 }} />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.statBox, { borderColor: colors.border }]}
          onPress={() => router.push('/Blocked_contact')}
        >
          <Text style={[styles.statNumber, { color: colors.text }]}>0</Text>
          <View style={styles.statLinkRow}>
            <Text style={[styles.statLink, { color: colors.primary }]}>Blacklist</Text>
            <Ionicons name="chevron-forward" size={14} color={colors.primary} />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.statBox, { borderColor: colors.border }]}
          onPress={() => router.push('/Whitelist_contact')}
        >
          <Text style={[styles.statNumber, { color: colors.text }]}>0</Text>
          <View style={styles.statLinkRow}>
            <Text style={[styles.statLink, { color: colors.primary }]}>Whitelist</Text>
            <Ionicons name="chevron-forward" size={14} color={colors.primary} />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
    elevation: 3,
    shadowColor: Colors.light.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  timerBox: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
  },
  timerText: {
    fontSize: 13,
  },
  timerLabel: {
    fontSize: 12,
    marginTop: 8,
  },
  timerValue: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 2,
  },
  profileValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  deleteIconBtn: {
    marginTop: -90,
    marginLeft: 120,
    fontWeight:'700',
    width:'200',
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  statBox: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
  },
  statTitle: {
    fontSize: 12,
  },
  statNumber: {
    fontSize: 16,
    fontWeight: '700',
  },
  statLinkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    justifyContent: 'flex-start',
  },
  statLink: {
    flexShrink: 0,
    fontSize: 12,
    fontWeight: '600',
    marginRight: 2,
  },
});
