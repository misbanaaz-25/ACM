import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons, Feather, MaterialIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import ScheduleModal from './timer';
import BatteryLowIcon from '@/components/ui/Icon/battery_low_icon';
import Calendericon from '@/components/ui/Icon/calender';
import Car from '@/components/ui/Icon/driving';
import Mycall from '@/components/ui/Icon/mycall';
import Notwell from '@/components/ui/Icon/notwellicon';
import Holiday from '@/components/ui/Icon/holidayicon';
import Movie from '@/components/ui/Icon/movieicon';
import Training from '@/components/ui/Icon/trainingicon';
import CallIcon from '@/components/ui/Icon/notavailable';
import MeetingIcon from '@/components/ui/Icon/meeting';
import GymIcon from '@/components/ui/Icon/gymicon';
import TravellingIcon from '@/components/ui/Icon/travelling';
import PlusIcon from '@/components/ui/Icon/customprofile';
import CricketIcon from '@/components/ui/Icon/cricketicon';
import PrayerIcon from '@/components/ui/Icon/prayericon';
import SmallTimer from '@/components/ui/modals/smalltimer';
import AlertModal from '@/components/ui/modals/AlertModal';
import { changeActiveProfile } from '@/components/services/acmApi';


type Props = {
  activeTab: 'manage' | 'schedule';
  onCustomProfilePress: () => void;
  isSubscribed: boolean;
  onRequireSubscription: () => void;
};

export default function ManageProfileGrid({
   activeTab,
  onCustomProfilePress,
  isSubscribed,
  onRequireSubscription,
}: Props) {
  const colors = Colors.light;
  const [showAll, setShowAll] = useState(false);

  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showSmallTimer, setShowSmallTimer] = useState(false);

  // ab track karna padega kaunsa profile select hua hai
  const [selectedProfile, setSelectedProfile] = useState('');

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');

  const showAlert = (title: string, message: string) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertVisible(true);
  };


    const manageProfileItems = [
      {
        icon: <CallIcon size={32} color={colors.primary} />,
        label: 'Not Available',
      },
      {
        icon: <MeetingIcon size={32} color={colors.primary} />,
        label: 'Meeting',
      },
      {
        icon: <Calendericon size={32} color={colors.primary} />,
        label: 'Busy',
      },
      {
        icon: <BatteryLowIcon size={32} color={colors.primary} />,
        label: 'Low battery',
      },
      {
        icon: <Holiday size={32} color={colors.primary} />,
        label: 'Holiday',
      },
      {
        icon: <Car size={32} color={colors.primary} />,
        label: 'Driving',
      },
      {
        icon: <Notwell size={32} color={colors.primary} />,
        label: 'Not Well',
      },
      {
        icon: <PrayerIcon size={32} color={colors.primary} />,
        label: 'Prayer',
      },
      {
        icon: <TravellingIcon size={32} color={colors.primary} />,
        label: 'Travelling',
      },
      {
        icon: <Mycall size={32} color={colors.primary} />,
        label: 'My call only',
      },
      {
        icon: <GymIcon size={32} color={colors.primary} />,
        label: 'Gym',
      },
      {
        icon: <Training size={32} color={colors.primary} />,
        label: 'Training',
      },
      {
        icon: <Movie size={32} color={colors.primary} />,
        label: 'Movie',
      },
      {
        icon: <CricketIcon size={32} color={colors.primary} />,
        label: 'Cricket',
      },
      {
        icon: <PlusIcon size={32} color={colors.primary} />,
        label: 'Custom Profile',
      },
      {
        icon: <Ionicons name="bookmark" size={32} color={colors.white} />,
        label: 'Saved Profile',
        active: true,
      },
    ];


  const visibleItems = showAll ? manageProfileItems : manageProfileItems.slice(0, 8);

  const handleItemPress = (label: string) => {

    if (!isSubscribed) {
      onRequireSubscription();
      return;
    }

    if (label === 'Custom Profile') {
      onCustomProfilePress();
      return;
    }

    // yaha profile ka naam save kar rahe hain, taaki submit ke time API ko bhej sake
    setSelectedProfile(label);

    if (activeTab === 'manage') {
      setShowSmallTimer(true);
    } else {
      setShowScheduleModal(true);
    }
  };

  // SmallTimer se hour/minute aata hai, usse duration string banate hain API ke liye
  const handleSmallTimerSubmit = async (hour: number, minute: number) => {
    setShowSmallTimer(false);

    // duration minutes mein bhej rahe hain total
    const totalMinutes = hour * 60 + minute;

    const result = await changeActiveProfile(selectedProfile, String(totalMinutes));

    if (result.success) {
      showAlert('Success', result.message);
    } else {
      showAlert('Error', result.message);
    }
  };

  return (
    <>
      <View style={styles.grid}>
        {visibleItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.gridItem}
            onPress={() => handleItemPress(item.label)}
          >
            <View
              style={[
                styles.gridIconBox,
                { backgroundColor: colors.secondary },
                item.active && { backgroundColor: colors.primary },
              ]}
              >
              {item.icon}
            </View>
            <Text style={[styles.gridLabel, { color: colors.text }]}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity onPress={() => setShowAll(!showAll)}>
        <Text style={[styles.seeMore, { color: colors.primary }]}>
          {showAll ? 'See Less' : 'See more'}
        </Text>
      </TouchableOpacity>

      <SmallTimer
        visible={showSmallTimer}
        onClose={() => setShowSmallTimer(false)}
        onSubmit={handleSmallTimerSubmit}
        onStart={(hour, minute) => {
          console.log('Timer started:', hour, minute);
        }}
      />

      <ScheduleModal
        visible={showScheduleModal}
        onClose={() => setShowScheduleModal(false)}
        onSaveDate={(date) => console.log('Date saved:', date)}
        onSubmitTime={(data) => console.log('Time submitted:', data)}
      />

      <AlertModal
        visible={alertVisible}
        title={alertTitle}
        message={alertMessage}
        onClose={() => setAlertVisible(false)}
      />

      {/* Schedule Profile tab → pehle choice popup (Set Date / Set Time) */}

    </>
  );
}

const styles = StyleSheet.create({
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
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  gridLabel: {
    fontSize: 7,
    width: '100%',
    textAlign: 'center',
  },
  seeMore: {
    textAlign: 'center',
    fontWeight: '700',
    fontSize: 14,
    marginTop: 4,
  },
});