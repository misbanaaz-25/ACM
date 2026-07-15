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

    if (activeTab === 'manage') {
      setShowSmallTimer(true);
    } else {
      setShowScheduleModal(true);
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
        onSubmit={(hour, minute) => {
          setShowSmallTimer(false);
          console.log('Manage Profile time:', hour, minute);
        }}
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