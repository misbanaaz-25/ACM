import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import BottomBar from '../components/ui/modals/BottomBar';

const blockedCallsData = [
  { id: '1', name: 'Lana Steiner', phone: '+91 6584357775', date: '1-07-2026, 09:09 pm', profile: 'Meeting' },
  { id: '2', name: 'Lana Steiner', phone: '+91 6584357775', date: '1-07-2026, 09:09 pm', profile: 'Meeting' },
  { id: '3', name: 'Lana Steiner', phone: '+91 6584357775', date: '1-07-2026, 09:09 pm', profile: 'Meeting' },
  { id: '4', name: 'Lana Steiner', phone: '+91 6584357775', date: '1-07-2026, 09:09 pm', profile: 'Meeting' },
  { id: '5', name: 'Lana Steiner', phone: '+91 6584357775', date: '1-07-2026, 09:09 pm', profile: 'Meeting' },
  { id: '6', name: 'Lana Steiner', phone: '+91 6584357775', date: '1-07-2026, 09:09 pm', profile: 'Meeting' },
];

export default function BlockedCallsScreen() {
  const { width } = useWindowDimensions();
  const cardWidth = Math.min(width * 0.9, 480);
  const colors = Colors.light;

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor={colors.secondary} />
      <LinearGradient
        colors={[colors.secondary, colors.background]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* top wala header, title + edit button */}
          <View style={[styles.headerRow, { width: cardWidth }]}>
            <Text style={[styles.title, { color: colors.text }]}>calls</Text>
            <TouchableOpacity>
              <Text style={[styles.editText, { color: colors.primary }]}>Edit</Text>
            </TouchableOpacity>
          </View>

          {/* saari calls yaha list ho rahi hai */}
          <View style={{ width: cardWidth }}>
            {blockedCallsData.map((item, index) => (
              <View
                key={item.id}
                style={[
                  styles.callRow,
                  { borderBottomColor: colors.border },
                  index === blockedCallsData.length - 1 && { borderBottomWidth: 0 },
                ]}
              >
                <View style={[styles.avatar, { backgroundColor: colors.secondary }]}>
                  <Ionicons name="person" size={22} color={colors.text} />
                </View>

                <View style={styles.callInfo}>
                  <Text style={[styles.callName, { color: colors.text }]}>{item.name}</Text>
                  <Text style={[styles.callPhone, { color: colors.text }]}>{item.phone}</Text>
                </View>

                <View style={styles.callMeta}>
                  <Text style={[styles.callDate, { color: colors.text }]}>{item.date}</Text>
                  <Text style={[styles.callProfile, { color: colors.text }]}>{item.profile}</Text>
                </View>

                <Ionicons name="call" size={22} color={colors.success} />
              </View>
            ))}
          </View>
        </ScrollView>

        {/* ab bottom bar shared component se aa raha hai */}
        <BottomBar active="calls" />
      </LinearGradient>
    </>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 110,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
  },
  editText: {
    fontSize: 16,
    fontWeight: '600',
  },
  callRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    gap: 10,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  callInfo: {
    flex: 1,
  },
  callName: {
    fontSize: 15,
    fontWeight: '700',
  },
  callPhone: {
    fontSize: 13,
    marginTop: 2,
  },
  callMeta: {
    alignItems: 'flex-end',
  },
  callDate: {
    fontSize: 12,
  },
  callProfile: {
    fontSize: 11,
    marginTop: 2,
    width: 100,
    textAlign: 'right',
  },
});