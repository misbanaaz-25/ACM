// ACM ka API service - yaha saare backend calls honge

import AsyncStorage from '@react-native-async-storage/async-storage';

const SCL_BASE_URL = 'https://acm.mcarbon.com/ACM_APP_3.4/SclClient';
const SUBSCRIBE_URL = 'https://acm.mcarbon.com/ACMService/thirdparty/v1/Subscribe';
const CHANGE_PROFILE_URL = 'https://acm.mcarbon.com/ACMService/thirdparty/v1/ChangeActiveProfile';
const ENCODE_MSISDN_URL = 'https://acm.mcarbon.com/ACMService/encode';
const OTP_CNF_URL = SCL_BASE_URL;

// har request ko unique TID chahiye hota hai, isliye time se generate kar rahe hain
function generateTid(): string {
  const now = new Date();
  const yy = String(now.getFullYear()).slice(2);
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const hh = String(now.getHours()).padStart(2, '0');
  const min = String(now.getMinutes()).padStart(2, '0');
  const ss = String(now.getSeconds()).padStart(2, '0');
  return `${yy}${mm}${dd}${hh}${min}${ss}`;
}

export interface SendOtpResult {
  success: boolean;
  message: string;
  regionId?: string;
}

export async function sendOtp(mobile: string): Promise<SendOtpResult> {
  const tid = generateTid();

  const xmlBody = `<?xml version="1.0" encoding="ISO-8859-1"?>
<SCL>
    <MSG>SEND_OTP</MSG>
    <MSISDN>${mobile}</MSISDN>
    <APP_VER>3.7</APP_VER>
    <OS>AN|35</OS>
    <AUTHKEY>12345</AUTHKEY>
    <TYPE0>NO</TYPE0>
    <TID>${tid}</TID>
    <APP_VER>3.4.0</APP_VER>
</SCL>`;

  try {
    const response = await fetch(SCL_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/xml; charset=ISO-8859-1',
      },
      body: xmlBody,
    });

    const responseText = await response.text();

    // response XML mein aata hai, regex se values nikal rahe hain
    const statusMatch = responseText.match(/<STATUS>(.*?)<\/STATUS>/);
    const disMsgMatch = responseText.match(/<DISMSG>(.*?)<\/DISMSG>/);
    const regionMatch = responseText.match(/<REGIONID>(.*?)<\/REGIONID>/);

    const status = statusMatch ? statusMatch[1] : '';
    const disMsg = disMsgMatch ? disMsgMatch[1] : 'Something went wrong, please try again';

    if (status === 'TRUE') {
      return {
        success: true,
        message: disMsg,
        regionId: regionMatch ? regionMatch[1] : undefined,
      };
    }

    return {
      success: false,
      message: disMsg,
    };
  } catch (error) {
    console.log('sendOtp error:', error);
    return {
      success: false,
      message: 'Network error, please check your internet and try again',
    };
  }
}

export interface SubscribeResult {
  success: boolean;
  message: string;
  maskedMsisdn?: string;
}

export async function subscribeUser(mobile: string): Promise<SubscribeResult> {
  const tid = generateTid();

  try {
    const response = await fetch(SUBSCRIBE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Msisdn': mobile,
        'Circle': 'UW',
        'Authorization': 'AcmThanksApp',
      },
      body: JSON.stringify({
        tid: tid,
        os: 'Android|11.0.1',
      }),
    });

    const data = await response.json();

    if (data.statusCode === 200 && data.maskedMsisdn) {
      return {
        success: true,
        message: data.msg || 'Subscribed successfully',
        maskedMsisdn: data.maskedMsisdn,
      };
    }

    return {
      success: false,
      message: data.msg || 'Subscription failed, please try again',
    };
  } catch (error) {
    console.log('subscribeUser error:', error);
    return {
      success: false,
      message: 'Network error, please check your internet and try again',
    };
  }
}

export interface ChangeProfileResult {
  success: boolean;
  message: string;
}

export interface EncodeMsisdnResult {
  success: boolean;
  message: string;
  encodedMsisdn?: string;
}

export async function changeActiveProfile(
  profileName: string,
  duration: string
): Promise<ChangeProfileResult> {
  // pehle saved maskedMsisdn nikalna hoga, jo subscribe ke time save hua tha
  const maskedMsisdn = await AsyncStorage.getItem('maskedMsisdn');

  if (!maskedMsisdn) {
    return {
      success: false,
      message: 'Please subscribe first before activating a profile',
    };
  }

  const tid = generateTid();

  try {
    const response = await fetch(CHANGE_PROFILE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'maskedMsisdn': maskedMsisdn,
        'Authorization': 'AcmThanksApp',
      },
      body: JSON.stringify({
        tid: tid,
        os: 'Android|11.0.1',
        name: profileName,
        duration: duration,
      }),
    });

    const data = await response.json();

    if (data.statusCode === 200) {
      return {
        success: true,
        message: data.msg || 'Profile activated successfully',
      };
    }

    return {
      success: false,
      message: data.msg || 'Could not activate profile, please try again',
    };
  } catch (error) {
    console.log('changeActiveProfile error:', error);
    return {
      success: false,
      message: 'Network error, please check your internet and try again',
    };
  }
}

export async function encodeMsisdn(
  mobile: string
): Promise<EncodeMsisdnResult> {
  try {
    const response = await fetch(ENCODE_MSISDN_URL, {
      method: 'GET',
      headers: {
        msisdn: mobile,
      },
    });

    const encodedValue = await response.text();

    if (response.ok) {
      return {
        success: true,
        message: 'MSISDN encoded successfully',
        encodedMsisdn: encodedValue,
      };
    }

    return {
      success: false,
      message: 'Encoding failed',
    };
  } catch (error) {
    console.log('encodeMsisdn error:', error);

    return {
      success: false,
      message: 'Network error',
    };
  }
}

export interface VerifyOtpResult {
  success: boolean;
  message: string;
}

export async function verifyOtp(mobile: string, otp: string): Promise<VerifyOtpResult> {
  const tid = generateTid();

  const xmlBody = `<?xml version="1.0" encoding="ISO-8859-1"?>
<SCL>
    <MSG>OTP_CNF</MSG>
    <MSISDN>${mobile}</MSISDN>
    <OS>AN|35</OS>
    <AUTHKEY>12345</AUTHKEY>
    <OTP>${otp}</OTP>
    <TID>${tid}</TID>
    <APP_VER>3.4.0</APP_VER>
</SCL>`;

  try {
    const response = await fetch(OTP_CNF_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/xml; charset=ISO-8859-1',
      },
      body: xmlBody,
    });

    const responseText = await response.text();

    const resultMatch = responseText.match(/<RESULT>(.*?)<\/RESULT>/);
    const disMsgMatch = responseText.match(/<DISMSG>(.*?)<\/DISMSG>/);

    const result = resultMatch ? resultMatch[1] : '';
    const disMsg = disMsgMatch ? disMsgMatch[1] : 'Something went wrong, please try again';

    if (result === 'FAIL') {
      return { success: false, message: disMsg };
    }

    return { success: true, message: disMsg };
  } catch (error) {
    console.log('verifyOtp error:', error);
    return { success: false, message: 'Network error, please check your internet and try again' };
  }
}