import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
  Image,
  useWindowDimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, Feather, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Modal } from 'react-native';


const manageProfileItems = [
  { icon: <MaterialIcons name="phone-disabled" size={32} color="#D40000" />, label: 'Not Available' },
  { icon: <Ionicons name="people-outline" size={32} color="#D40000" />, label: 'Meeting' },
  { icon: <Feather name="calendar" size={32} color="#D40000" />, label: 'Busy' },
  { icon: <MaterialIcons name="battery-alert" size={32} color="#D40000" />, label: 'Low battery' },
  { icon: <MaterialIcons name="beach-access" size={32} color="#D40000" />, label: 'Holiday' },
  { icon: <MaterialIcons name="directions-car" size={32} color="#D40000" />, label: 'Driving' },
  { icon: <Ionicons name="sad-outline" size={32} color="#D40000" />, label: 'Not Well' },
  { icon: <MaterialIcons name="self-improvement" size={32} color="#D40000" />, label: 'Prayer' },
  { icon: <Ionicons name="airplane-outline" size={32} color="#D40000" />, label: 'Travelling' },
  { icon: <Ionicons name="call-outline" size={32} color="#D40000" />, label: 'My call only' },
  { icon: <MaterialIcons name="fitness-center" size={32} color="#D40000" />, label: 'Gym' },
  { icon: <MaterialIcons name="cast-for-education" size={32} color="#D40000" />, label: 'Training' },
  { icon: <MaterialIcons name="movie-creation" size={32} color="#D40000" />, label: 'Movie' },
  { icon: <MaterialIcons name="sports-cricket" size={32} color="#D40000" />, label: 'Cricket' },
  { icon: <Feather name="plus" size={32} color="#D40000" />, label: 'Custom Profile' },
  { icon: <Ionicons name="bookmark" size={32} color="#fff" />, label: 'Saved Profile', active: true },
];

export default function HomeScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const cardWidth = width > 500 ? 480 : width * 0.9;

  const [activeTab, setActiveTab] = useState('manage'); // 'manage' | 'schedule'
  const [showAll, setShowAll] = useState(false);
  const [whitelistNumber, setWhitelistNumber] = useState('');
  const [blacklistTab, setBlacklistTab] = useState('blacklist'); // 'blacklist' | 'advance'
  const [blacklistNumber, setBlacklistNumber] = useState('');
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);

  const visibleItems = showAll ? manageProfileItems : manageProfileItems.slice(0, 8);

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
          {/* Header */}
          <View style={[styles.headerRow, { width: cardWidth }]}>
            <View style={styles.headerLeft}>
              <Image
                source={{ uri: 'https://i.pravatar.cc/100' }}
                style={styles.avatar}
              />
              <View>
                <Text style={styles.greeting}>Good Morning User!</Text>
                <Text style={styles.subGreeting}>Welcome to Airtel Call Manager</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.settingsBtn}
              onPress={() => router.push('/setting')}
            >
              <Ionicons name="settings-outline" size={22} color="#D40000" />
            </TouchableOpacity>
          </View>

          {/* Subscription card */}
          <View style={[styles.subscribeCard, { width: cardWidth }]}>
            <Text style={styles.subscribeText}>
              Subscribe now to personalize and control your calls
            </Text>

            <TouchableOpacity style={styles.subscribeButton} onPress={() => setShowWelcomeModal(true)}>
                        <Text style={styles.subscribeButtonText}>Subscribe</Text>
                      </TouchableOpacity>
                    </View>


          {/* Dashboard card */}
          <View style={[styles.card, { width: cardWidth }]}>
            <Text style={styles.cardTitle}>Dashboard</Text>

            <View style={styles.timerBox}>
              <Text style={styles.timerText}>00 hr: 00 min: 00 sec</Text>
              <Text style={styles.timerLabel}>My Profile</Text>
              <Text style={styles.timerValue}>No profile</Text>
            </View>

            <View style={styles.statRow}>
              <View style={styles.statBox}>
                <Text style={styles.statTitle}>No Profile</Text>
                <View style={styles.statLinkRow}>
                  <Text style={styles.statLink}>Schedule Profile</Text>
                  <Ionicons name="chevron-forward" size={14} color="#D40000" />
                </View>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statNumber}>0</Text>
                <View style={styles.statLinkRow}>
                  <Text style={styles.statLink}>Blacklist</Text>
                  <Ionicons name="chevron-forward" size={14} color="#D40000" />
                </View>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statNumber}>0</Text>
                <View style={styles.statLinkRow}>
                  <Text style={styles.statLink}>Whitelist</Text>
                  <Ionicons name="chevron-forward" size={14} color="#D40000" />
                </View>
              </View>
            </View>
          </View>

          {/* Manage / Schedule Profile card */}
          <View style={[styles.card, { width: cardWidth }]}>
            <View style={styles.tabRow}>
              <TouchableOpacity onPress={() => setActiveTab('manage')}>
                <Text style={[styles.tabText, activeTab === 'manage' && styles.tabTextActive]}>
                  Manage Profile
                </Text>
                {activeTab === 'manage' && <View style={styles.tabUnderline} />}
              </TouchableOpacity>

              <TouchableOpacity onPress={() => setActiveTab('schedule')}>
                <Text style={[styles.tabText, activeTab === 'schedule' && styles.tabTextActive]}>
                  Schedule Profile
                </Text>
                {activeTab === 'schedule' && <View style={styles.tabUnderline} />}
              </TouchableOpacity>
            </View>

            <View style={styles.grid}>
              {visibleItems.map((item, index) => (
                <View key={index} style={styles.gridItem}>
                  <View
                    style={[
                      styles.gridIconBox,
                      item.active && { backgroundColor: '#D40000' },
                    ]}
                  >
                    {item.icon}
                  </View>
                  <Text style={styles.gridLabel}>{item.label}</Text>
                </View>
              ))}
            </View>

            <TouchableOpacity onPress={() => setShowAll(!showAll)}>
              <Text style={styles.seeMore}>{showAll ? 'See Less' : 'See more'}</Text>
            </TouchableOpacity>
          </View>

          {/* Whitelist card */}
          <View style={[styles.card, { width: cardWidth }]}>
            <Text style={styles.sectionTitle}>whitelist</Text>
            <Text style={styles.sectionSubtitle}>Enter the number you want to always allow</Text>

            <TouchableOpacity
              style={styles.addNumberBtn}

            >
              <Text style={styles.addNumberText}>Add Number</Text>
              <Feather name="plus" size={18} color="#D40000" />
            </TouchableOpacity>
          </View>

          {/* Blacklist card */}
          <View style={[styles.card, { width: cardWidth }]}>
            <View style={styles.tabRow}>
              <TouchableOpacity onPress={() => setBlacklistTab('blacklist')}>
                <Text
                  style={[
                    styles.tabText,
                    blacklistTab === 'blacklist' && styles.tabTextActive,
                  ]}
                >
                  Blacklist
                </Text>
                {blacklistTab === 'blacklist' && <View style={styles.tabUnderline} />}
              </TouchableOpacity>

              <TouchableOpacity onPress={() => setBlacklistTab('advance')}>
                <Text
                  style={[
                    styles.tabText,
                    blacklistTab === 'advance' && styles.tabTextActive,
                  ]}
                >
                  Advance blacklist
                </Text>
                {blacklistTab === 'advance' && <View style={styles.tabUnderline} />}
              </TouchableOpacity>
            </View>

            <Text style={styles.sectionSubtitle}>Enter the number you want to block</Text>

            <TouchableOpacity
              style={styles.addNumberBtn}
            >
              <Text style={styles.addNumberText}>Add Number</Text>
              <Feather name="plus" size={18} color="#D40000" />
            </TouchableOpacity>
          </View>
        </ScrollView>

               {/* Bottom tab bar - ab yaha hai, ScrollView ke bahar */}
               <View style={[styles.bottomBar, { width: width - 40 }]}>
                 <TouchableOpacity style={styles.bottomTab}>
                   <Ionicons name="home" size={22} color="#fff" />
                   <Text style={styles.bottomTabText}>Home</Text>
                 </TouchableOpacity>
                 <TouchableOpacity style={styles.bottomTab}>
                   <Ionicons name="call-outline" size={22} color="#fff" />
                   <Text style={styles.bottomTabText}>Blocked calls</Text>
                 </TouchableOpacity>
                 <TouchableOpacity style={styles.bottomTab}>
                   <Ionicons name="checkmark-circle-outline" size={22} color="#fff" />
                   <Text style={styles.bottomTabText}>Manage access</Text>
                 </TouchableOpacity>
               </View>

         {/* Welcome Modal */}
                <Modal
                  visible={showWelcomeModal}
                  transparent
                  animationType="fade"
                  onRequestClose={() => setShowWelcomeModal(false)}
                >
                  <View style={styles.modalOverlay}>
                    <View style={[styles.modalCard, { width: cardWidth }]}>
                      <Text style={styles.modalText}>
                        Hello!{'\n'}As a privileged Airtel customer you have been granted free access to Airtel Call Manager services.
                      </Text>
                      <TouchableOpacity
                        style={styles.modalBtn}
                        onPress={() => {
                          setShowWelcomeModal(false);
                          router.push('/main');
                        }}
                      >
                        <Text style={styles.modalBtnText}>Okay</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </Modal>

      </LinearGradient>
    </>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 110, // space for bottom bar
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
    width:300,
    color: '#000',
  },
  subGreeting: {
    fontSize: 12,
    height:20,
    width:300,
    color: '#555',
    marginTop: 2,
  },
  settingsBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: '#D40000',
    justifyContent: 'center',
    alignItems: 'center',
  },
 subscribeCard: {
   flexDirection: 'row',
   alignItems: 'center',
   justifyContent: 'space-between',
   backgroundColor: '#fff',
   borderRadius: 16,
   paddingVertical: 16,
   paddingHorizontal: 16,
   elevation: 3,
   shadowColor: '#000',
   shadowOffset: { width: 0, height: 2 },
   shadowOpacity: 0.08,
   shadowRadius: 8,
 },
 subscribeText: {
   flex: 1,
   fontSize: 14,
   color: '#000',
   fontWeight: '500',
   lineHeight: 19,
   marginRight: 12,
 },
 subscribeButton: {
   backgroundColor: '#D40000',
   borderRadius: 99,
   paddingVertical: 12,
   paddingHorizontal: 22,
 },
 subscribeButtonText: {
   color: '#fff',
   fontSize: 14,
   fontWeight: '700',
 },


  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
    marginBottom: 12,
  },
  timerBox: {
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
  },
  timerText: {
    fontSize: 13,
    color: '#999',
  },
  timerLabel: {
    fontSize: 12,
    color: '#999',
    marginTop: 8,
  },
  timerValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
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
    borderColor: '#eee',
    borderRadius: 10,
    padding: 10,
  },
  statTitle: {
    fontSize: 12,
    color: '#999',
  },
  statNumber: {
    fontSize: 16,
    fontWeight: '700',
    color: '#999',
  },
  statLinkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  statLink: {
    fontSize: 12,
    color: '#D40000',
    fontWeight: '600',
  },
  tabRow: {
    flexDirection: 'row',
    gap: 24,
    marginBottom: 16,
  },
  tabText: {
    width:150,
    fontSize: 15,
    color: '#000',
    paddingBottom: 6,
  },
  tabTextActive: {
    color: '#D40000',
    fontWeight: '700',
  },
  tabUnderline: {
    height: 2,
    backgroundColor: '#D40000',
    borderRadius: 2,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridItem: {
    width: '23%',
    alignItems: 'center',
    marginBottom: 18,
  },
  gridIconBox: {
    width: 56,
    height: 56,
    borderRadius: 14,
    backgroundColor: '#FFEAEA',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  gridLabel: {
    fontSize: 7,
    width:'100%',
    color: '#333',
    textAlign: 'center',
  },
  seeMore: {
    textAlign: 'center',
    color: '#D40000',
    fontWeight: '700',
    fontSize: 14,
    marginTop: 4,
  },
  sectionTitle: {
    paddingLeft:'118',
    fontSize: 16,
    fontWeight: '700',
    color: '#D40000',
    marginBottom: 12,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: '#333',
    marginBottom: 16,
  },
  addNumberBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#D40000',
    borderRadius: 99,
    paddingVertical: 14,
  },
  addNumberText: {
    color: '#D40000',
    fontSize: 15,
    fontWeight: '700',
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

modalOverlay: {
  flex: 1,
  backgroundColor: 'rgba(0,0,0,0.4)',
  justifyContent: 'center',
  alignItems: 'center',
},
modalCard: {
  backgroundColor: '#fff',
  borderRadius: 16,
  paddingVertical: 28,
  paddingHorizontal: 24,
  alignItems: 'center',
},
modalText: {
  fontSize: 15,
  color: '#000',
  textAlign: 'center',
  lineHeight: 22,
  marginBottom: 24,
},
modalBtn: {
  backgroundColor: '#D40000',
  borderRadius: 99,
  paddingVertical: 14,
  width: '100%',
  alignItems: 'center',
},
modalBtnText: {
  color: '#fff',
  fontSize: 16,
  fontWeight: '700',
},

});