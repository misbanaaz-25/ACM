import AsyncStorage from '@react-native-async-storage/async-storage';
import { encodeMsisdn, subscribeUserScl } from '@/components/services/acmApi';

export interface SubscriptionResult {
  success: boolean;
  message: string;
}

// Ye hook sirf "subscribe karna" wala poora business logic sambhalta hai:
// - AsyncStorage se saved mobile number nikalna
// - usko encode karna (encodeMsisdn)
// - phir encoded value se subscribe karna (subscribeUserScl)
// - success hone par encoded MSISDN ko "maskedMsisdn" ke naam se save karna
//
// SRP fix: pehle ye sab logic seedha SubscribeCard.tsx ke andar tha,
// jisse woh component UI (card + modal) + API-logic dono handle kar raha tha.
// Ab SubscribeCard sirf UI dikhane pe focus karega.
export function useSubscription() {
  const subscribe = async (): Promise<SubscriptionResult> => {
    const mobile = await AsyncStorage.getItem('mobileNumber');

    if (!mobile) {
      return { success: false, message: 'Mobile number not found, please login again' };
    }

    // step 1: mobile ko pehle encode karo - Subscribe API ko encoded MSISDN chahiye hoti hai
    const encodeResult = await encodeMsisdn(mobile);

    if (!encodeResult.success || !encodeResult.encodedMsisdn) {
      return { success: false, message: encodeResult.message };
    }

    // step 2: ab encoded MSISDN se subscribe karo (XML/SCL wali API)
    const result = await subscribeUserScl(encodeResult.encodedMsisdn);

    if (!result.success) {
      return { success: false, message: result.message };
    }

    // encoded value hi save kar rahe hain - yahi "maskedMsisdn" ki tarah baaki APIs
    // (profile activate/delete) mein use hoga
    await AsyncStorage.setItem('maskedMsisdn', encodeResult.encodedMsisdn);

    return { success: true, message: result.message };
  };

  return { subscribe };
}