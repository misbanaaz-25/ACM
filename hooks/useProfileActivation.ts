import AsyncStorage from '@react-native-async-storage/async-storage';
import { changeActiveProfileScl } from '@/components/services/acmApi';

export interface ActivationResult {
  success: boolean;
  message: string;
}

// Ye hook sirf "profile activate karna" wala kaam sambhalta hai:
// - encoded MSISDN AsyncStorage se nikalna
// - changeActiveProfileScl API ko call karna
// - success hone par naya profile + uska timer end-time AsyncStorage mein save karna
// - parent ko (onProfileChange callback ke through) naya profile bata dena
//
// SRP fix: pehle ye sab logic seedha ManageProfileGrid.tsx ke andar tha,
// jisse woh component UI + API-logic dono handle kar raha tha.
// Ab ManageProfileGrid sirf UI/grid dikhane pe focus karega.
export function useProfileActivation(
  onProfileChange: (profile: string, endTime: number | null) => void
) {
  // profileName + duration (hour, minute) leke poora activation flow chalata hai
  const activateProfile = async (
    profileName: string,
    hour: number,
    minute: number
  ): Promise<ActivationResult> => {
    const maskedMsisdn = await AsyncStorage.getItem('maskedMsisdn');

    if (!maskedMsisdn) {
      return { success: false, message: 'Please subscribe first before changing profile' };
    }

    const result = await changeActiveProfileScl(maskedMsisdn, profileName);

    if (!result.success) {
      return { success: false, message: result.message };
    }

    // duration se timer ka "end time" nikal rahe hain (abhi ka time + total seconds)
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