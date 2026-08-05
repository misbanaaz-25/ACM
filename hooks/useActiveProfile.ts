import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { changeActiveProfileScl } from '@/components/services/acmApi';

export function useActiveProfile(showAlert: (title: string, message: string) => void) {
  const [activeProfile, setActiveProfile] = useState('No profile');
  const [profileEndTime, setProfileEndTime] = useState<number | null>(null);


  useEffect(() => {
    const loadProfile = async () => {
      const saved = await AsyncStorage.getItem('activeProfile');
      if (saved) setActiveProfile(saved);

      const savedEndTime = await AsyncStorage.getItem('profileEndTime');
      if (savedEndTime) setProfileEndTime(Number(savedEndTime));
    };
    loadProfile();
  }, []);

  // ManageProfileGrid se profile change hone par naam + timer dono update
  const handleProfileChange = (profile: string, endTime: number | null) => {
    setActiveProfile(profile);
    setProfileEndTime(endTime);
  };


 const handleDeleteProfile = async () => {
   const maskedMsisdn = await AsyncStorage.getItem('maskedMsisdn');

   if (!maskedMsisdn) {
     showAlert('Error', 'Please subscribe first');
     return;
   }

   const removedProfileName = activeProfile;

   const result = await changeActiveProfileScl(maskedMsisdn, 'General', '0min');

   if (result.success) {
     await AsyncStorage.removeItem('activeProfile');
     await AsyncStorage.removeItem('profileEndTime');
     setActiveProfile('No profile');
     setProfileEndTime(null);
     showAlert('Success', `${removedProfileName} profile has been removed`);
   } else {
     showAlert('Error', result.message);
   }
 };

  return {
    activeProfile,
    profileEndTime,
    handleProfileChange,
    handleDeleteProfile,
  };
}