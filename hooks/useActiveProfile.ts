import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { changeActiveProfileScl } from '@/components/services/acmApi';

// Ye hook sirf "active profile" se related kaam sambhalta hai:
// - profile ka naam + uska end time (timer ke liye) track karna
// - screen open hote hi AsyncStorage se pichla saved profile load karna
// - Dashboard ke X icon se profile delete/reset karna
//
// SRP fix: pehle ye sab logic seedha main.tsx (HomeScreen) ke andar tha,
// jisse woh component UI + profile-logic dono handle kar raha tha.
// Ab main.tsx sirf UI render karega, profile ka poora "business logic" yahin hoga.
export function useActiveProfile(showAlert: (title: string, message: string) => void) {
  const [activeProfile, setActiveProfile] = useState('No profile');
  const [profileEndTime, setProfileEndTime] = useState<number | null>(null);

  // screen open hote hi AsyncStorage se pichla saved profile aur uska end time load karo
  useEffect(() => {
    const loadProfile = async () => {
      const saved = await AsyncStorage.getItem('activeProfile');
      if (saved) setActiveProfile(saved);

      const savedEndTime = await AsyncStorage.getItem('profileEndTime');
      if (savedEndTime) setProfileEndTime(Number(savedEndTime));
    };
    loadProfile();
  }, []);

  // ManageProfileGrid se profile change hone par naam + timer dono update karo
  const handleProfileChange = (profile: string, endTime: number | null) => {
    setActiveProfile(profile);
    setProfileEndTime(endTime);
  };

  // Dashboard ke "X" icon se profile delete/reset karne ke liye
  // same API use hoti hai jo activate ke liye hoti hai, bas "General" bhejte hain
  const handleDeleteProfile = async () => {
    const maskedMsisdn = await AsyncStorage.getItem('maskedMsisdn');

    if (!maskedMsisdn) {
      showAlert('Error', 'Please subscribe first');
      return;
    }

    const result = await changeActiveProfileScl(maskedMsisdn, 'General');

    if (result.success) {
      await AsyncStorage.removeItem('activeProfile');
      await AsyncStorage.removeItem('profileEndTime');
      setActiveProfile('No profile');
      setProfileEndTime(null);
      showAlert('Success', result.message);
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