import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons, Feather, MaterialIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';

type Props = {
  onCustomProfilePress: () => void;
  onGymPress: () => void;
};

export default function ManageProfileGrid({ onCustomProfilePress, onGymPress }: Props) {
  const colors = Colors.light;
  const [showAll, setShowAll] = useState(false);

  const manageProfileItems = [
    {
      icon: <MaterialIcons name="phone-disabled" size={32} color={colors.primary} />,
      label: 'Not Available',
    },
    {
      icon: <Ionicons name="people-outline" size={32} color={colors.primary} />,
      label: 'Meeting',
    },
    {
      icon: <Feather name="calendar" size={32} color={colors.primary} />,
      label: 'Busy',
    },
    {
      icon: <MaterialIcons name="battery-alert" size={32} color={colors.primary} />,
      label: 'Low battery',
    },
    {
      icon: <MaterialIcons name="beach-access" size={32} color={colors.primary} />,
      label: 'Holiday',
    },
    {
      icon: <MaterialIcons name="directions-car" size={32} color={colors.primary} />,
      label: 'Driving',
    },
    {
      icon: <Ionicons name="sad-outline" size={32} color={colors.primary} />,
      label: 'Not Well',
    },
    {
      icon: <MaterialIcons name="self-improvement" size={32} color={colors.primary} />,
      label: 'Prayer',
    },
    {
      icon: <Ionicons name="airplane-outline" size={32} color={colors.primary} />,
      label: 'Travelling',
    },
    {
      icon: <Ionicons name="call-outline" size={32} color={colors.primary} />,
      label: 'My call only',
    },
    {
      icon: <MaterialIcons name="fitness-center" size={32} color={colors.primary} />,
      label: 'Gym',
    },
    {
      icon: <MaterialIcons name="cast-for-education" size={32} color={colors.primary} />,
      label: 'Training',
    },
    {
      icon: <MaterialIcons name="movie-creation" size={32} color={colors.primary} />,
      label: 'Movie',
    },
    {
      icon: <MaterialIcons name="sports-cricket" size={32} color={colors.primary} />,
      label: 'Cricket',
    },
    {
      icon: <Feather name="plus" size={32} color={colors.primary} />,
      label: 'Custom Profile',
    },
    {
      icon: <Ionicons name="bookmark" size={32} color={colors.white} />,
      label: 'Saved Profile',
      active: true,
    },
  ];

  const visibleItems = showAll ? manageProfileItems : manageProfileItems.slice(0, 8);

  return (
    <>
      <View style={styles.grid}>
        {visibleItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.gridItem}
            onPress={() => {
              // in dono items ka apna modal hai, baaki sab abhi bina action k hain
              if (item.label === 'Custom Profile') {
                onCustomProfilePress();
              }
              if (item.label === 'Gym') {
                onGymPress();
              }
            }}
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