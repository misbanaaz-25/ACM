import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import TutorialIcon from '@/components/ui/Icon/tutorial_icon';
import FeedbackIcon from '@/components/ui/Icon/feedback_icon';
import HelpIcon from '@/components/ui/Icon/help_icon';
import ShareIcon from '@/components/ui/Icon/share_icon';
import UnsubscribeIcon from '@/components/ui/Icon/unsubscribe_icon';

export default function SettingsScreen() {
  const { width } = useWindowDimensions();
  const cardWidth = width > 500 ? 480 : width * 0.9;
  const router = useRouter();

  const [mobileNumber, setMobileNumber] = useState('');

  useEffect(() => {
    const loadMobile = async () => {
      const saved = await AsyncStorage.getItem('mobileNumber');
      if (saved) setMobileNumber(saved);
    };
    loadMobile();
  }, []);

  const menuItems = [
    { icon: <TutorialIcon size={20} color="#000" />, label: 'View tutorial' },
    { icon: <FeedbackIcon size={20} color="#000" />, label: 'Feedback' },
    { icon: <HelpIcon size={20} color="#000" />, label: 'Help' },
    { icon: <Ionicons name="eye-outline" size={20} color="#000" />, label: 'Show Tips' },
    { icon: <ShareIcon size={20} color="#000" />, label: 'Share app' },
    { icon: <UnsubscribeIcon size={20} color="#000" />, label: 'unsubscribe' },
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
          <Text style={[styles.title, { width: cardWidth }]}>Settings</Text>

          <View style={[styles.card, { width: cardWidth }]}>
            {/* User row */}
            <View style={styles.userRow}>
              <View style={styles.avatar}>
                <Ionicons name="person-outline" size={22} color="#888" />
              </View>

              <View style={styles.userInfo}>
                <Text style={styles.userName}>User</Text>
                <Text style={styles.userPhone}>+91 {mobileNumber}</Text>
              </View>

              <TouchableOpacity style={styles.createProfileBtn} onPress={() => router.push('/Create_profile')}>
                <Text style={styles.createProfileText}>Create Profile</Text>
              </TouchableOpacity>
            </View>

            {/* Menu items */}
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.menuRow,
                  index === menuItems.length - 1 && { borderBottomWidth: 0 },
                ]}
              >
                <View style={styles.menuLeft}>
                  {item.icon}
                  <Text style={styles.menuLabel}>{item.label}</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#999" />
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </LinearGradient>
    </>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#000000',
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
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userInfo: {
    flex: 1,
    marginLeft: 12,
  },
  userName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
  },
  userPhone: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  createProfileBtn: {
    backgroundColor: '#D40000',
    borderRadius: 99,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  createProfileText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuLabel: {
    width: 100,
    fontSize: 15,
    color: '#000',
  },
});