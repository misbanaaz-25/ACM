import { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
  Image,
  useWindowDimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/theme';
import RecordingModal from '@/components/ui/modals/recording';
import AdvanceBlacklistContent from '@/components/ui/modals/advanceblacklist';
import WhitelistModal from '@/components/ui/modals/whitelist';
import BlacklistModal from '@/components/ui/modals/blacklist';
import ManageProfileGrid from '@/components/ui/modals/ManageProfileGrid';
import BottomBar from '@/components/ui/modals/BottomBar';
import SubscribeCard from '@/components/ui/modals/SubscribeCard';
import AlertModal from '@/components/ui/modals/AlertModal';


export default function HomeScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const cardWidth = width > 500 ? 480 : width * 0.9;

  const colors = Colors.light;

  const [activeTab, setActiveTab] = useState('manage'); // 'manage' | 'schedule'
  const [blacklistTab, setBlacklistTab] = useState('blacklist'); // 'blacklist' | 'advance'
  const [showRecordingModal, setShowRecordingModal] = useState(false);
  const [showWhitelistModal, setShowWhitelistModal] = useState(false);
  const [showBlacklistModal, setShowBlacklistModal] = useState(false);

  // grid, whitelist, blacklist all three are locked before subscribe
  const [isSubscribed, setIsSubscribed] = useState(false);

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');

  const showAlert = (title: string, message: string) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertVisible(true);
  };

  // if not subscribed show alert !
  const requireSubscription = (action: () => void) => {
    if (!isSubscribed) {
      showAlert('Subscribe first', 'Subscribe to access Service of Airtel Call Manager');
      return;
    }
    action();
  };

  // ManageProfileGrid alerts (for icons)
  const showSubscribeAlert = () => {
    showAlert('Subscribe first', 'Subscribe to access Service of Airtel Call Manager');
  };

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
          {/* ------Header----- */}
          <View style={[styles.headerRow, { width: cardWidth }]}>
            <View style={styles.headerLeft}>
              <Image
                source={{ uri: 'https://i.pravatar.cc/100' }}
                style={styles.avatar}
              />
              <View>
                <Text style={[styles.greeting, { color: colors.text }]}>Good Morning John!</Text>
                <Text style={[styles.subGreeting, { color: colors.text }]}>No important calls missed today</Text>
              </View>
            </View>
            <TouchableOpacity
              style={[styles.settingsBtn, { borderColor: colors.primary }]}
              onPress={() => router.push('/setting')}
            >
              <Ionicons name="settings-outline" size={22} color={colors.primary} />
            </TouchableOpacity>
          </View>

          {/* Subscribe card  */}
          {!isSubscribed && (
            <SubscribeCard
              cardWidth={cardWidth}
              onSubscribe={() => setIsSubscribed(true)}
            />
          )}

          {/*------ Dashboard card------ */}
          <View style={[styles.card, { width: cardWidth, backgroundColor: colors.white }]}>
            <Text style={[styles.cardTitle, { color: colors.text }]}>Dashboard</Text>

            <View style={[styles.timerBox, { borderColor: colors.border }]}>
              <Text style={[styles.timerText, { color: colors.text }]}>00 hr: 00 min: 00 sec</Text>
              <Text style={[styles.timerLabel, { color: colors.text }]}>My Profile</Text>
              <Text style={[styles.timerValue, { color: colors.text }]}>No profile</Text>
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
                  <Text style={[styles.statLink, { color: colors.primary }]}>
                    Whitelist
                  </Text>
                  <Ionicons name="chevron-forward" size={14} color={colors.primary} />
                </View>
              </TouchableOpacity>
            </View>
          </View>

             {/* Manage / Schedule Profile card */}
          <View style={[styles.card, { width: cardWidth, backgroundColor: colors.white }]}>
            <View style={styles.tabRow}>
              <TouchableOpacity onPress={() => setActiveTab('manage')}>
                <Text
                  style={[
                    styles.tabText,
                    { color: colors.text },
                    activeTab === 'manage' && { color: colors.primary, fontWeight: '700' },
                  ]}
                >
                  Manage Profile
                </Text>
                {activeTab === 'manage' && <View style={[styles.tabUnderline, { backgroundColor: colors.primary }]} />}
              </TouchableOpacity>

              <TouchableOpacity onPress={() => setActiveTab('schedule')}>
                <Text
                  style={[
                    styles.tabText,
                    { color: colors.text },
                    activeTab === 'schedule' && { color: colors.primary, fontWeight: '700' },
                  ]}
                >
                  Schedule Profile
                </Text>
                {activeTab === 'schedule' && <View style={[styles.tabUnderline, { backgroundColor: colors.primary }]} />}
              </TouchableOpacity>
            </View>

            {/* Manage Profile ka poora grid alag file mein hai - ab subscribe check grid ke andar hi hota hai */}
            <ManageProfileGrid
              activeTab={activeTab}
              onCustomProfilePress={() => setShowRecordingModal(true)}
              isSubscribed={isSubscribed}
              onRequireSubscription={showSubscribeAlert}
            />
          </View>

          {/* Whitelist card */}
          <View style={[styles.card, { width: cardWidth, backgroundColor: colors.white }]}>
            <Text style={[styles.sectionTitle, { color: colors.primary }]}> Add to whitelist</Text>
            <Text style={[styles.sectionSubtitle, { color: colors.text }]}>
              Enter the number you want to always allow
            </Text>

            <TouchableOpacity
              style={[styles.addNumberBtn, { borderColor: colors.primary }]}
              onPress={() => requireSubscription(() => setShowWhitelistModal(true))}
            >
              <Text style={[styles.addNumberText, { color: colors.primary }]}>Add Number</Text>
              <Feather name="plus" size={18} color={colors.primary} />
            </TouchableOpacity>
          </View>

          {/* Blacklist card */}
          <View style={[styles.card, { width: cardWidth, backgroundColor: colors.white }]}>
            <View style={styles.tabRow}>
              <TouchableOpacity onPress={() => setBlacklistTab('blacklist')}>
                <Text
                  style={[
                    styles.tabText,
                    { color: colors.text },
                    blacklistTab === 'blacklist' && { color: colors.primary, fontWeight: '700' },
                  ]}
                >
                  Blacklist
                </Text>
                {blacklistTab === 'blacklist' && <View style={[styles.tabUnderline, { backgroundColor: colors.primary }]} />}
              </TouchableOpacity>

              <TouchableOpacity onPress={() => setBlacklistTab('advance')}>
                <Text
                  style={[
                    styles.tabText,
                    { color: colors.text },
                    blacklistTab === 'advance' && { color: colors.primary, fontWeight: '700' },
                  ]}
                >
                  Advance blacklist
                </Text>
                {blacklistTab === 'advance' && <View style={[styles.tabUnderline, { backgroundColor: colors.primary }]} />}
              </TouchableOpacity>
            </View>

            {blacklistTab === 'blacklist' ? (
              <>
                <Text style={[styles.sectionSubtitle, { color: colors.text }]}>
                  Enter the number you want to block
                </Text>

                <TouchableOpacity
                  style={[styles.addNumberBtn, { borderColor: colors.primary }]}
                  onPress={() => requireSubscription(() => setShowBlacklistModal(true))}
                >
                  <Text style={[styles.addNumberText, { color: colors.primary }]}>Add Number</Text>
                  <Feather name="plus" size={18} color={colors.primary} />
                </TouchableOpacity>
              </>
            ) : (
              <AdvanceBlacklistContent />
            )}
          </View>

        </ScrollView>


        {/* Bottom Bar - fixed at the bottom, outside ScrollView */}
        <BottomBar active="home" />

        {/* Recording Modal */}
        <RecordingModal
          visible={showRecordingModal}
          onClose={() => setShowRecordingModal(false)}
        />

        {/* Whitelist Modal - options + enter numbers + alert  */}
        <WhitelistModal
          visible={showWhitelistModal}
          onClose={() => setShowWhitelistModal(false)}
        />

        {/* Blacklist Modal - options + enter number  */}
        <BlacklistModal
          visible={showBlacklistModal}
          onClose={() => setShowBlacklistModal(false)}
        />
        <AlertModal
          visible={alertVisible}
          title={alertTitle}
          message={alertMessage}
          onClose={() => setAlertVisible(false)}
        />
      </LinearGradient>
    </>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 110,
    gap: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  greeting: {
    fontSize: 18,
    fontWeight: '700',
  },
  subGreeting: {
    fontSize: 12,
    marginTop: 2,
  },
  settingsBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
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
      justifyContent: 'flex-start'
  },
  statLink: {
      flexShrink:0,
     fontSize: 12,
      fontWeight: '600',
      marginRight: 2,
  },
  tabRow: {
     flexDirection: 'row',
     justifyContent: 'space-evenly',
     marginBottom: 16,
  },
  tabText: {
      minWidth: 120,
      fontSize: 15,
      paddingBottom: 6,
      textAlign: 'center',
  },
  tabUnderline: {
    height: 2,
    borderRadius: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  sectionSubtitle: {
    fontSize: 13,
    marginBottom: 16,
  },
  addNumberBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderRadius: 99,
    paddingVertical: 14,
  },
  addNumberText: {
    fontSize: 15,
    fontWeight: '700',
  },
});
