import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/theme';

interface DashboardCardProps {
  cardWidth: number;
  activeProfile: string;
}

export default function DashboardCard({ cardWidth, activeProfile }: DashboardCardProps) {
  const router = useRouter();
  const colors = Colors.light;

  return (
    <View style={[styles.card, { width: cardWidth, backgroundColor: colors.white }]}>
      <Text style={[styles.cardTitle, { color: colors.text }]}>Dashboard</Text>

      <View style={[styles.timerBox, { borderColor: colors.border }]}>
        <Text style={[styles.timerText, { color: colors.text }]}>00 hr: 00 min: 00 sec</Text>
        <Text style={[styles.timerLabel, { color: colors.text }]}>My Profile</Text>
        <Text style={[styles.timerValue, { color: colors.text }]}>{activeProfile}</Text>
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
