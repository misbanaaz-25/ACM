import AsyncStorage from '@react-native-async-storage/async-storage';
import { changeActiveProfileScl } from '@/components/services/acmApi';

export interface ActivationResult {
  success: boolean;
  message: string;
}

export function useProfileActivation(
  onProfileChange: (profile: string, endTime: number | null) => void
) {
  // profileName + duration (hour, minute)
  const activateProfile = async (
    profileName: string,
    hour: number,
    minute: number
  ): Promise<ActivationResult> => {
    const maskedMsisdn = await AsyncStorage.getItem('maskedMsisdn');

    if (!maskedMsisdn) {
      return { success: false, message: 'Please subscribe first before changing profile' };
    }

    const totalMinutes = hour * 60 + minute +"min";
    const durationStr = String(totalMinutes);

    const result = await changeActiveProfileScl(maskedMsisdn, profileName, durationStr);

    if (!result.success) {
      return { success: false, message: result.message };
    }

    const totalMs = (hour * 60 + minute) * 60 * 1000;
    const endTime = totalMs > 0 ? Date.now() + totalMs : null;

    await AsyncStorage.setItem('activeProfile', profileName);
    if (endTime) {
      await AsyncStorage.setItem('profileEndTime', String(endTime));
    } else {
      await AsyncStorage.removeItem('profileEndTime');
    }

    onProfileChange(profileName, endTime);

    return { success: true, message: result.message };
  };

  return { activateProfile };
}