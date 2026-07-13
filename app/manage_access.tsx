import { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
  Switch,
  useWindowDimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import BottomBar from '@/components/ui/modals/BottomBar';

export default function ManageAccessScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const cardWidth = Math.min(width * 0.9, 480);

  const [blockedAlert, setBlockedAlert] = useState(true);
  const [profileExpiry, setProfileExpiry] = useState(false);
  const [internationalRoaming, setInternationalRoaming] = useState(false);
  const [disableAutoNotif, setDisableAutoNotif] = useState(false);

  const settingsItems = [
    {
      title: 'Blocked number alert',
      subtitle: 'Notify when blocked number calls',
      value: blockedAlert,
      onToggle: () => setBlockedAlert(!blockedAlert),
      hasToggle: true,
    },
    {
      title: 'Profile Expiry Alert',
      subtitle: 'Automatically notify callers after profile expiry',
      value: profileExpiry,
      onToggle: () => setProfileExpiry(!profileExpiry),
      hasToggle: true,
    },
    {
      title: 'International Roaming',
      subtitle: 'Auto activate profile when travelling out of India',
      value: internationalRoaming,
      onToggle: () => setInternationalRoaming(!internationalRoaming),
      hasToggle: true,
    },
    {
      title: 'Disable Auto Notifications',
      subtitle: 'Block automatic notification messages',
      value: disableAutoNotif,
      onToggle: () => setDisableAutoNotif(!disableAutoNotif),
      hasToggle: true,
    },
    {
      title: 'Phonebook Backup & Restore',
      subtitle: 'Backup and restore your contacts',
      hasToggle: false,
      onPress: () => router.push('/phone_backup')
    },
  ];

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#FFE8E8" />
      <LinearGradient
        colors={['#FFE8E8', '#FFFFFF']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Title */}
          <Text style={[styles.title, { width: cardWidth }]}>Manage Access</Text>

          {/* Settings Card */}
          <View style={[styles.card, { width: cardWidth }]}>
           {settingsItems.map((item, index) => (
             <TouchableOpacity
               key={index}
               activeOpacity={item.onPress ? 0.6 : 1}
               onPress={item.onPress}
               style={[
                 styles.settingRow,
                 index === settingsItems.length - 1 && { borderBottomWidth: 0 },
               ]}
             >
               <View style={styles.settingInfo}>
                 <Text style={styles.settingTitle}>{item.title}</Text>
                 <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
               </View>
               {item.hasToggle && (
                 <Switch
                   value={item.value}
                   onValueChange={item.onToggle}
                   trackColor={{ false: '#ddd', true: '#D40000' }}
                   thumbColor="#fff"
                 />
               )}
             </TouchableOpacity>
           ))}
          </View>
        </ScrollView>
        <BottomBar active="access" />
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
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#000',
    marginBottom: 24,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  settingInfo: {
    flex: 1,
    paddingRight: 12,
  },
  settingTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#000',
    marginBottom: 4,
  },
  settingSubtitle: {
    fontSize: 12,
    color: '#666',
    lineHeight: 18,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    backgroundColor: '#D40000',
    borderRadius: 99,
    flexDirection: 'row',
    justifyContent: 'space-around',
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
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
  },
  activeIndicator: {
    width: 20,
    height: 3,
    backgroundColor: '#fff',
    borderRadius: 99,
    marginTop: 2,
  },
});